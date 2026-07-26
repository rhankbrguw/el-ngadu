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
        $updatedData = $this->service->updateProfile(Auth::getUserId(), Auth::getUserType(), $input);
        
        foreach ($updatedData as $key => $value) {
            $_SESSION[$key] = $value;
        }
        
        Response::success(\Constants\AppMessages::SUCCESS_UPDATE_PROFILE);
    }
}
