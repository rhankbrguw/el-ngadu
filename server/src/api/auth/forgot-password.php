<?php

require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/EmailService.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || empty(trim($input['email']))) {
  throw new \Core\ValidationException("Email wajib diisi.");
}

$email = trim($input['email']);
$pdo = Database::connect();

try {
    $table = null;
    $id_column = null;
    $id_value = null;
    $nama = null;

    // Check masyarakat
    $sql = "SELECT nik, nama FROM masyarakat WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $table = 'masyarakat';
        $id_column = 'nik';
        $id_value = $user['nik'];
        $nama = $user['nama'];
    } else {
        // Check petugas
        $sql = "SELECT id_petugas, nama_petugas FROM petugas WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $petugas = $stmt->fetch();

        if ($petugas) {
            $table = 'petugas';
            $id_column = 'id_petugas';
            $id_value = $petugas['id_petugas'];
            $nama = $petugas['nama_petugas'];
        }
    }

    if (!$table) {
        // Return success even if email not found to prevent email enumeration attacks
        \Core\Response::json(['message' => 'Jika email Anda terdaftar, tautan reset password telah dikirimkan.']);
        exit();
    }

    $token = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', strtotime('+30 minutes'));

    $sql = "UPDATE {$table} SET reset_token = ?, reset_expires_at = ? WHERE {$id_column} = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token, $expires_at, $id_value]);

    $resetLink = "http://localhost:5173/reset-password?token=" . $token;

    $emailService = new \Components\EmailService();
    $emailTitle = "Reset Password Anda";
    $emailContent = "<p>Halo <strong>" . htmlspecialchars($nama) . "</strong>,</p>";
    $emailContent .= "<p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Klik tombol di bawah ini untuk mengatur kata sandi baru:</p>";
    $emailContent .= "<div style='text-align: center; margin: 30px 0;'>
                        <a href='{$resetLink}' style='background-color: #eab308; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>Reset Password</a>
                      </div>";
    $emailContent .= "<p>Tautan ini hanya berlaku selama <strong>30 menit</strong>. Jika Anda tidak meminta reset password, abaikan email ini.</p>";

    $emailService->sendEmail($email, "Reset Password El-Ngadu", $emailTitle, $emailContent);

    \Core\Response::json(['message' => 'Jika email Anda terdaftar, tautan reset password telah dikirimkan.']);
} catch (PDOException $e) {
    throw new \Core\BaseException('Terjadi kesalahan sistem.', 500);
}
