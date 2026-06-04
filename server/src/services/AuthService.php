<?php

namespace Services;

use Components\Database;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;

/**
 * Service for handling Authentication business logic
 */
class AuthService {
    
    public function legacyLogin(string $username, string $password): array {
        $pdo = Database::connect();
        $sql = "SELECT nik, nama, username, password, telp FROM masyarakat WHERE username = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $public_user = [
                'nik' => $user['nik'],
                'nama' => $user['nama'],
                'username' => $user['username'],
                'telp' => $user['telp']
            ];
            return ['status' => 'success', 'user' => $user, 'public_user' => $public_user];
        }
        throw new \Core\ValidationException(\Core\Messages::AUTH_USER_NOT_FOUND);
    }

    /**
     * Authenticate user and handle OTP logic
     *
     * @param string $username
     * @param string $password
     * @return array Response data containing auth status or OTP requirement
     * @throws BaseException
     */
    public function unifiedLogin(string $username, string $password): array {
        $pdo = Database::connect();
        
        // Cek masyarakat
        $stmt = $pdo->prepare("SELECT nik, nama, username, password, telp, email, is_verified FROM masyarakat WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            if (!$user['is_verified']) {
                return $this->handleOtp($pdo, 'masyarakat', 'nik', $user['nik'], $user['email'], $user['nama'], 'masyarakat', $username);
            }
            return ['status' => 'success', 'user' => $user, 'type' => 'masyarakat'];
        }

        // Cek petugas
        $stmt = $pdo->prepare("SELECT id_petugas, nama_petugas, username, password, telp, level, email, is_verified FROM petugas WHERE username = ?");
        $stmt->execute([$username]);
        $petugas = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($petugas && password_verify($password, $petugas['password'])) {
            if (!$petugas['is_verified']) {
                return $this->handleOtp($pdo, 'petugas', 'id_petugas', $petugas['id_petugas'], $petugas['email'], $petugas['nama_petugas'], 'petugas', $username);
            }
            return ['status' => 'success', 'user' => $petugas, 'type' => 'petugas'];
        }

        throw new \Core\UnauthorizedException(AppMessages::ERR_INVALID_CREDENTIALS);
    }

    private function handleOtp(\PDO $pdo, string $table, string $idColumn, string $idValue, ?string $email, string $nama, string $userType, string $username): array {
        if (empty($email)) {
            throw new BaseException(AppMessages::ERR_EMAIL_NOT_SET, 400);
        }
        
        $otpCode = sprintf("%06d", mt_rand(1, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $sql = "UPDATE {$table} SET otp_code = ?, otp_expires_at = ? WHERE {$idColumn} = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$otpCode, $expiresAt, $idValue]);

        $emailService = new EmailService();
        $emailService->sendEmail(
            $email, 
            AppMessages::EMAIL_SUBJECT_OTP, 
            AppMessages::EMAIL_TITLE_OTP, 
            sprintf(AppMessages::EMAIL_CONTENT_OTP, htmlspecialchars($nama), $otpCode)
        );

        return [
            'requires_otp' => true,
            'message' => 'OTP telah dikirim ke email Anda.',
            'userType' => $userType,
            'username' => $username
        ];
    }

    public function verifyOtp(string $username, string $otp_code, string $userType): array {
        $pdo = Database::connect();
        
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $idCol = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            throw new \Core\UnauthorizedException(AppMessages::ERR_ACCOUNT_NOT_FOUND);
        }

        if ($user['otp_code'] !== $otp_code || strtotime($user['otp_expires_at']) < time()) {
            throw new \Core\ValidationException(AppMessages::ERR_INVALID_OTP);
        }

        $stmt_clear = $pdo->prepare("UPDATE {$table} SET otp_code = NULL, otp_expires_at = NULL, is_verified = 1 WHERE {$idCol} = ?");
        $stmt_clear->execute([$user[$idCol]]);

        if ($userType === 'masyarakat') {
            \Components\NotificationManager::create($pdo, $user['nik'], 'masyarakat', AppMessages::NOTIF_WELCOME_MSG);
            $emailService = new EmailService();
            $emailService->sendEmail(
                $user['email'], 
                AppMessages::EMAIL_SUBJECT_WELCOME, 
                AppMessages::EMAIL_TITLE_WELCOME, 
                sprintf(AppMessages::EMAIL_CONTENT_WELCOME, htmlspecialchars($user['nama']))
            );
        }

        return ['status' => 'success', 'user' => $user];
    }
}
