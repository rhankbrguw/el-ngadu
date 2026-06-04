<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
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
            throw new UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MENGAKSES_SUMBER ?? "Harus login");
        }
        
        $user = $this->service->getProfile(Auth::getUserId(), Auth::getUserType());
        Response::json(['user' => $user]);
    }

    public function updateProfile(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA ?? "Harus login");
        }
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $updatedData = $this->service->updateProfile(Auth::getUserId(), Auth::getUserType(), $input);
        
        foreach ($updatedData as $key => $value) {
            $_SESSION[$key] = $value;
        }
        
        Response::json(['message' => 'Profil berhasil diperbarui.']);
    }
}
