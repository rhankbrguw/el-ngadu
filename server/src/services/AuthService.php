<?php

namespace Services;

use Repositories\AuthRepository;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;
use Constants\Config;

/**
 * Service for handling Authentication business logic
 */
class AuthService {
    
    private AuthRepository $repository;
    
    public function __construct() {
        $this->repository = new AuthRepository();
    }
    
    public function legacyLogin(string $username, string $password): array {
        $user = $this->repository->getCitizenByUsername($username);

        if ($user && password_verify($password, $user['password'])) {
            $public_user = [
                'nik' => $user['nik'],
                'nama' => $user['nama'],
                'username' => $user['username'],
                'telp' => $user['telp']
            ];
            return ['status' => 'success', 'user' => $user, 'public_user' => $public_user];
        }
        throw new \Core\ValidationException(\Constants\AppMessages::ERR_ACCOUNT_NOT_FOUND);
    }

    public function unifiedLogin(string $username, string $password): array {
        $user = $this->repository->getCitizenByUsername($username);

        if ($user && password_verify($password, $user['password'])) {
            if (!$user['is_verified']) {
                return $this->handleOtp('masyarakat', 'nik', $user['nik'], $user['email'], $user['nama'], 'masyarakat', $username);
            }
            return ['status' => 'success', 'user' => $user, 'type' => 'masyarakat'];
        }

        $petugas = $this->repository->getOfficerByUsername($username);

        if ($petugas && password_verify($password, $petugas['password'])) {
            if (!$petugas['is_verified']) {
                return $this->handleOtp('petugas', 'id_petugas', $petugas['id_petugas'], $petugas['email'], $petugas['nama_petugas'], 'petugas', $username);
            }
            return ['status' => 'success', 'user' => $petugas, 'type' => 'petugas'];
        }

        throw new \Core\UnauthorizedException(AppMessages::ERR_INVALID_CREDENTIALS);
    }

    private function handleOtp(string $table, string $idColumn, string $idValue, ?string $email, string $nama, string $userType, string $username): array {
        if (empty($email)) {
            throw new BaseException(AppMessages::ERR_EMAIL_NOT_SET, 400);
        }
        
        $otpCode = sprintf("%06d", mt_rand(1, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . Config::OTP_EXPIRY_MINUTES . ' minutes'));

        $this->repository->updateOtp($table, $idColumn, $idValue, $otpCode, $expiresAt);

        EmailService::getInstance()->sendEmail(
            $email, 
            AppMessages::EMAIL_SUBJECT_OTP, 
            AppMessages::EMAIL_TITLE_OTP, 
            sprintf(AppMessages::EMAIL_CONTENT_OTP, htmlspecialchars($nama), $otpCode)
        );

        return [
            'requires_otp' => true,
            'message' => AppMessages::MSG_OTP_SENT,
            'userType' => $userType,
            'username' => $username
        ];
    }

    public function verifyOtp(string $username, string $otp_code, string $userType): array {
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $idCol = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $user = $this->repository->getUserByUsername($table, $username);

        if (!$user) {
            throw new \Core\UnauthorizedException(AppMessages::ERR_ACCOUNT_NOT_FOUND);
        }

        if ($user['otp_code'] !== $otp_code || strtotime($user['otp_expires_at']) < time()) {
            throw new \Core\ValidationException(AppMessages::ERR_INVALID_OTP);
        }

        $this->repository->verifyAndClearOtp($table, $idCol, $user[$idCol]);

        if ($userType === 'masyarakat') {
            \Components\NotificationManager::create($this->repository->getPdo(), $user['nik'], 'masyarakat', AppMessages::NOTIF_WELCOME_MSG);
            EmailService::getInstance()->sendEmail(
                $user['email'], 
                AppMessages::EMAIL_SUBJECT_WELCOME, 
                AppMessages::EMAIL_TITLE_WELCOME, 
                sprintf(AppMessages::EMAIL_CONTENT_WELCOME, htmlspecialchars($user['nama']))
            );
        }

        return ['status' => 'success', 'user' => $user];
    }
}
