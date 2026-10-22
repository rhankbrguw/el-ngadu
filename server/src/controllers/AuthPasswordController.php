<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Core\UnauthorizedException;
use Components\Auth;
use Services\AuthPasswordService;
use Rakit\Validation\Validator;
use Constants\AppMessages;

class AuthPasswordController {
    
    private AuthPasswordService $service;
    
    public function __construct() {
        $this->service = new AuthPasswordService();
    }

    public function forgotPassword(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validation = \Core\AppValidator::make($input, [
            'email' => 'required|email|trusted_email'
        ]);
        $validation->validate();


        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        
        $this->service->forgotPassword($validation->getValidData()['email']);
        Response::success(AppMessages::SUCCESS_FORGOT_PWD, ['message' => AppMessages::SUCCESS_FORGOT_PWD]);
    }

    public function resetPassword(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'token' => 'required',
            'password' => 'required|min:8'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        
        $data = $validation->getValidData();
        $this->service->resetPassword($data['token'], $data['password']);
        Response::success(AppMessages::SUCCESS_RESET_PWD, ['message' => AppMessages::SUCCESS_RESET_PWD]);
    }

    public function changePassword(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'old_password' => 'required',
            'new_password' => 'required|min:8'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        
        $data = $validation->getValidData();
        $this->service->changePassword((string)Auth::getUserId(), (string)Auth::getUserType(), $data['old_password'], $data['new_password']);
        Response::success(AppMessages::SUCCESS_UPDATE_PWD, ['message' => AppMessages::SUCCESS_UPDATE_PWD]);
    }
}
