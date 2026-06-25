<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Core\UnauthorizedException;
use Components\Auth;
use Services\AuthPasswordService;

class AuthPasswordController {
    
    private AuthPasswordService $service;
    
    public function __construct() {
        $this->service = new AuthPasswordService();
    }

    public function forgotPassword(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty(trim($input['email'] ?? ''))) {
            throw new ValidationException("Email wajib diisi.");
        }
        
        $this->service->forgotPassword(trim($input['email']));
        Response::json(['message' => \Constants\AppMessages::SUCCESS_FORGOT_PWD]);
    }

    public function resetPassword(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty(trim($input['token'] ?? '')) || empty($input['password'] ?? '')) {
            throw new ValidationException("Token dan kata sandi baru wajib diisi.");
        }
        
        $this->service->resetPassword(trim($input['token']), $input['password']);
        Response::json(['message' => \Constants\AppMessages::SUCCESS_RESET_PWD]);
    }

    public function changePassword(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA ?? "Harus login");
        }
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['old_password']) || empty($input['new_password'])) {
            throw new ValidationException(\Core\Messages::ERR_PASSWORD_LAMA_DAN_BARU_WAJIB_DIISI ?? "Password lama dan baru wajib diisi.");
        }
        if (strlen($input['new_password']) < 8) {
            throw new ValidationException(\Core\Messages::ERR_PASSWORD_BARU_HARUS_MINIMAL_8_KARAKTER ?? "Password baru minimal 8 karakter.");
        }
        
        $this->service->changePassword(Auth::getUserId(), Auth::getUserType(), $input['old_password'], $input['new_password']);
        Response::json(['message' => \Constants\AppMessages::SUCCESS_UPDATE_PWD]);
    }
}
