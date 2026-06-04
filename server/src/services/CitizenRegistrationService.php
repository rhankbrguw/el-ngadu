<?php

namespace Services;

use Components\Database;
use Components\EmailService;
use Core\BaseException;
use Core\ConflictException;
use Core\Messages;

class CitizenRegistrationService {
    public function register(array $data): array {
        $pdo = Database::connect();
        $hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

        try {
            $adminCountStmt = $pdo->query("SELECT COUNT(*) FROM petugas WHERE level = 'admin'");
            $adminCount = $adminCountStmt->fetchColumn();

            if ($adminCount == 0) {
                $sql = "INSERT INTO petugas (nama_petugas, username, password, email, telp, level, is_verified) VALUES (?, ?, ?, ?, ?, 'admin', 1)";
                $statement = $pdo->prepare($sql);
                $statement->execute([$data['nama'], $data['username'], $hashed_password, $data['email'], $data['telp']]);
                
                $id_petugas = $pdo->lastInsertId();
                
                return [
                    'is_admin' => true,
                    'user' => [
                        'id_petugas' => $id_petugas,
                        'username' => $data['username'],
                        'nama_petugas' => $data['nama'],
                        'email' => $data['email'],
                        'telp' => $data['telp'],
                        'level' => 'admin',
                        'userType' => 'petugas'
                    ]
                ];
            } else {
                $sql = "INSERT INTO masyarakat (nik, nama, username, password, email, telp) VALUES (?, ?, ?, ?, ?, ?)";
                $statement = $pdo->prepare($sql);
                $statement->execute([$data['nik'], $data['nama'], $data['username'], $hashed_password, $data['email'], $data['telp']]);

                $otp_code = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);
                $otp_expires = date('Y-m-d H:i:s', strtotime('+5 minutes'));

                $updateOtp = $pdo->prepare("UPDATE masyarakat SET otp_code = ?, otp_expires_at = ? WHERE username = ?");
                $updateOtp->execute([$otp_code, $otp_expires, $data['username']]);

                $emailService = new EmailService();
                $emailTitle = "Kode Verifikasi Anda";
                $emailContent = "<p>Halo <strong>" . htmlspecialchars($data['nama']) . "</strong>,</p>";
                $emailContent .= "<p>Gunakan kode OTP berikut untuk melanjutkan. Kode ini berlaku selama <strong>5 menit</strong>.</p>";
                $emailContent .= "<div style='text-align: center; margin: 30px 0;'>
                                    <span style='background-color: #0f172a; color: #eab308; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px;'>" . $otp_code . "</span>
                                  </div>";
                $emailContent .= "<p>Jika Anda tidak merasa melakukan tindakan ini, abaikan email ini.</p>";

                $emailService->sendEmail($data['email'], "Kode OTP El-Ngadu", $emailTitle, $emailContent);

                return [
                    'is_admin' => false,
                    'username' => $data['username'],
                    'userType' => 'masyarakat',
                ];
            }
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new ConflictException(Messages::ERR_NIK_ATAU_USERNAME_SUDAH_TERDAFTAR);
            } else {
                throw new BaseException('Gagal melakukan registrasi: ' . $e->getMessage(), 500);
            }
        }
    }
}
