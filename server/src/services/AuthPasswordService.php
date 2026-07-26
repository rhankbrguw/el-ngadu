<?php

namespace Services;

use Repositories\AuthRepository;
use Components\EmailService;
use Core\ValidationException;
use Constants\Config;
use Constants\DesignTokens;

class AuthPasswordService {
    
    private AuthRepository $repository;
    
    public function __construct() {
        $this->repository = new AuthRepository();
    }
    
    public function forgotPassword(string $email): void {
        $user = $this->repository->getUserByEmail($email);
        
        if (!$user) return;

        $table = $user['type'];
        $id_col = $table === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+' . Config::RESET_TOKEN_EXPIRY_MINUTES . ' minutes'));
        
        $this->repository->updateResetToken($table, $id_col, $user['id'], $token, $expires);
        
        $appUrl = Config::getAppUrl();
        $resetLink = rtrim($appUrl, '/') . "/reset-password?token=" . $token;
        $bg = DesignTokens::COLOR_DARK;
        $fg = DesignTokens::COLOR_PRIMARY;
        $content = "<p>Halo <strong>" . htmlspecialchars($user['nama']) . "</strong>,</p>
                    <p>Klik tombol di bawah ini untuk mengatur kata sandi baru:</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{$resetLink}' style='background-color: {$bg}; color: {$fg}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
                    </div>";
        
        EmailService::getInstance()->sendEmail($email, "Reset Password El-Ngadu", "Reset Password Anda", $content);
    }

    public function resetPassword(string $token, string $password): void {
        $user = $this->repository->getUserByResetToken($token);
        
        if (!$user) throw new ValidationException("Tautan reset password tidak valid.");
        if (strtotime($user['reset_expires_at']) < time()) throw new ValidationException("Tautan reset password sudah kedaluwarsa.");
        if (password_verify($password, $user['password'])) throw new ValidationException("Password baru tidak boleh sama dengan password sebelumnya.");
        
        $table = $user['type'];
        $id_col = $table === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $this->repository->updatePasswordAndClearToken($table, $id_col, $user['id'], password_hash($password, PASSWORD_BCRYPT));
    }

    public function changePassword(string $userId, string $userType, string $oldPass, string $newPass): void {
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $id_col = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $user = $this->repository->getPasswordById($table, $id_col, $userId);
        
        if (!$user) throw new \Exception("Pengguna tidak ditemukan.", 404);
        if (!password_verify($oldPass, $user['password'])) throw new \Exception("Password lama yang Anda masukkan salah.", 401);
        if (password_verify($newPass, $user['password'])) throw new \Exception("Password baru tidak boleh sama dengan password saat ini.", 400);
        
        $this->repository->updatePassword($table, $id_col, $userId, password_hash($newPass, PASSWORD_DEFAULT));
    }
}
