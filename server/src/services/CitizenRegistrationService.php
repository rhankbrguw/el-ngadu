<?php

namespace Services;

use Repositories\CitizenRepository;
use Repositories\AuthRepository;
use Components\EmailService;
use Constants\AppMessages;
use Constants\Config;

class CitizenRegistrationService {
    
    private CitizenRepository $repository;
    private AuthRepository $authRepository;
    
    public function __construct() {
        $this->repository = new CitizenRepository();
        $this->authRepository = new AuthRepository();
    }
    
    public function register(array $data): array {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        if ($this->repository->getAdminCount() === 0) {
            return $this->handleAdminCreation($data);
        }
        return $this->handleCitizenCreation($data);
    }

    private function handleAdminCreation(array $data): array {
        $id_petugas = $this->repository->createAdmin($data);
        $user = [
            'id_petugas' => $id_petugas,
            'username' => $data['username'],
            'nama_petugas' => $data['nama'],
            'email' => $data['email'],
            'telp' => $data['telp'],
            'level' => 'admin',
            'userType' => 'petugas'
        ];

        return [
            'is_setup_wizard' => true,
            'user' => $user,
            'message' => AppMessages::SUCCESS_SETUP_WIZARD,
            'response_data' => [
                'bypass_otp' => true,
                'user' => $user
            ]
        ];
    }

    private function handleCitizenCreation(array $data): array {
        $this->repository->createCitizen($data);
        $otpCode = str_pad((string)rand(\Constants\Config::OTP_RANGE_MIN, \Constants\Config::OTP_RANGE_MAX), 6, '0', STR_PAD_LEFT);
        $otpExpires = date('Y-m-d H:i:s', strtotime('+' . Config::OTP_EXPIRY_MINUTES . ' minutes'));
        $this->authRepository->updateOtp('masyarakat', 'username', $data['username'], $otpCode, $otpExpires);
        
        EmailService::getInstance()->sendEmailAsync(
            $data['email'],
            AppMessages::EMAIL_SUBJECT_OTP,
            AppMessages::EMAIL_TITLE_OTP,
            sprintf(AppMessages::EMAIL_CONTENT_OTP, htmlspecialchars($data['nama']), $otpCode)
        );
        
        return [
            'is_setup_wizard' => false,
            'user' => null,
            'message' => AppMessages::SUCCESS_REGISTER,
            'response_data' => [
                'requires_otp' => true,
                'username' => $data['username'],
                'userType' => 'masyarakat',
            ]
        ];
    }
}
