<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Constants\AppMessages;
use Components\Auth;
use Services\AuthProfileService;

class AuthProfileController {
    
    private AuthProfileService $service;
    
    public function __construct() {
        $this->service = new AuthProfileService();
    }

    public function getProfile(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        
        $user = $this->service->getProfile((string)Auth::getUserId(), (string)Auth::getUserType());
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, ['user' => $user]);
    }

    public function updateProfile(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $userType = (string)Auth::getUserType();
        $userId = (string)Auth::getUserId();
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $id_col = $userType === 'masyarakat' ? 'nik' : 'id_petugas';

        $rules = [
            'username' => "nullable|min:3|unique_global:{$table},{$userId}",
            'email' => "nullable|email|unique_global:{$table},{$userId}",
            'telp' => "nullable|unique_global:{$table},{$userId}"
        ];

        if ($userType === 'masyarakat') {
            $rules['nama'] = 'nullable|min:3';
        } else {
            $rules['nama_petugas'] = 'nullable|min:3';
        }

        $validation = \Core\AppValidator::make($input, $rules);
        $validation->validate();

        if ($validation->fails()) {
            throw new \Core\ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $updatedData = $this->service->updateProfile($userId, $userType, $input);
        
        foreach ($updatedData as $key => $value) {
            $_SESSION[$key] = $value;
        }
        
        Response::success(\Constants\AppMessages::SUCCESS_UPDATE_PROFILE);
    }
}
