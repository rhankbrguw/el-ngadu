<?php

namespace Services;

use Components\Database;
use Components\EmailService;
use Core\BaseException;
use Core\ValidationException;

class AuthPasswordService {
    
    public function forgotPassword(string $email): void {
        $pdo = Database::connect();
        
        $sql = "SELECT nik as id, nama, 'masyarakat' as type FROM masyarakat WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $sql = "SELECT id_petugas as id, nama_petugas as nama, 'petugas' as type FROM petugas WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch();
        }
        
        if (!$user) return; // Silent success

        $table = $user['type'];
        $id_col = $table === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+30 minutes'));
        
        $sql = "UPDATE {$table} SET reset_token = ?, reset_expires_at = ? WHERE {$id_col} = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$token, $expires, $user['id']]);
        
        $resetLink = "http://localhost:5173/reset-password?token=" . $token;
        $content = "<p>Halo <strong>" . htmlspecialchars($user['nama']) . "</strong>,</p>
                    <p>Klik tombol di bawah ini untuk mengatur kata sandi baru:</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{$resetLink}' style='background-color: #eab308; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
                    </div>";
        
        (new EmailService())->sendEmail($email, "Reset Password El-Ngadu", "Reset Password Anda", $content);
    }

    public function resetPassword(string $token, string $password): void {
        $pdo = Database::connect();
        
        $sql = "SELECT nik as id, reset_expires_at, password, 'masyarakat' as type FROM masyarakat WHERE reset_token = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $sql = "SELECT id_petugas as id, reset_expires_at, password, 'petugas' as type FROM petugas WHERE reset_token = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$token]);
            $user = $stmt->fetch();
        }
        
        if (!$user) throw new ValidationException("Tautan reset password tidak valid.");
        if (strtotime($user['reset_expires_at']) < time()) throw new ValidationException("Tautan reset password sudah kedaluwarsa.");
        if (password_verify($password, $user['password'])) throw new ValidationException("Password baru tidak boleh sama dengan password sebelumnya.");
        
        $table = $user['type'];
        $id_col = $table === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $sql = "UPDATE {$table} SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE {$id_col} = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([password_hash($password, PASSWORD_BCRYPT), $user['id']]);
    }

    public function changePassword(string $userId, string $userType, string $oldPass, string $newPass): void {
        $pdo = Database::connect();
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $id_col = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $stmt = $pdo->prepare("SELECT password FROM {$table} WHERE {$id_col} = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user) throw new \Exception("Pengguna tidak ditemukan.", 404);
        if (!password_verify($oldPass, $user['password'])) throw new \Exception("Password lama yang Anda masukkan salah.", 401);
        if (password_verify($newPass, $user['password'])) throw new \Exception("Password baru tidak boleh sama dengan password saat ini.", 400);
        
        $stmt = $pdo->prepare("UPDATE {$table} SET password = ? WHERE {$id_col} = ?");
        $stmt->execute([password_hash($newPass, PASSWORD_DEFAULT), $userId]);
    }
}
