<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Core\UnauthorizedException;
use Components\Auth;
use Services\AuthProfileService;
use Rakit\Validation\Validator;
use Constants\AppMessages;

class AuthProfileController {
    
    private AuthProfileService $service;
    
    public function __construct() {
        $this->service = new AuthProfileService();
    }

    public function getProfile(): void {
        $this->requireAuth();
        
        $profile = $this->service->getProfile((string)Auth::getUserId(), (string)Auth::getUserType());
        Response::success(AppMessages::SUCCESS_OPERATION, $profile);
    }

    public function updateProfile(): void {
        $this->requireAuth();
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $userType = (string)Auth::getUserType();
        $userId = (string)Auth::getUserId();
        
        $this->validateProfileInput($input, $userType, $userId);
        
        $updatedData = $this->service->updateProfile($userId, $userType, $input);
        
        foreach ($updatedData as $key => $value) {
            $_SESSION[$key] = $value;
        }
        
        Response::success(AppMessages::SUCCESS_UPDATE_PROFILE);
    }

    private function requireAuth(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
    }

    private function validateProfileInput(array $input, string $userType, string $userId): void {
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $nameField = $userType === 'masyarakat' ? 'nama' : 'nama_petugas';

        $rules = [
            'username'  => "nullable|min:3|max:30|unique_global:{$table},{$userId}",
            'email'     => "nullable|email|trusted_email|unique_global:{$table},{$userId}",
            'telp'      => "nullable|valid_phone|unique_global:{$table},{$userId}",
            $nameField  => 'nullable|valid_name'
        ];

        $validation = \Core\AppValidator::make($input, $rules);
        $validation->validate();

        if ($validation->fails()) {
            throw new \Core\ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
    }
}
