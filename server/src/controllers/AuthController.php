<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Constants\AppMessages;
use Components\Auth;
use Services\AuthService;
use Rakit\Validation\Validator;

/**
 * Controller for managing Authentication
 */
class AuthController {
    
    private AuthService $authService;
    
    public function __construct() {
        $this->authService = new AuthService();
    }

    public function login(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'username' => 'required',
            'password' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        $data = $validation->getValidData();
        
        $result = $this->authService->legacyLogin($data['username'], $data['password']);
        Auth::startSession();
        Auth::login($result['user'], \Constants\Roles::MASYARAKAT);
        Response::success(AppMessages::SUCCESS_LOGIN, ['user' => $result['public_user']]);
    }

    public function unifiedLogin(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'username' => 'required',
            'password' => 'required'
        ]);
        
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        $result = $this->authService->unifiedLogin($data['username'], $data['password']);

        if (isset($result['requires_otp']) && $result['requires_otp']) {
            Response::success(AppMessages::MSG_OTP_REQUIRED, $result);
            return;
        }

        Auth::startSession();
        Auth::login($result['user'], $result['type']);
        
        Response::success(
            \Constants\AppMessages::SUCCESS_LOGIN,
            ['user' => $result['user']]
        );
    }

    public function verifyOtp(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'username' => 'required',
            'otp_code' => 'required',
            'userType' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        $data = $validation->getValidData();
        
        $result = $this->authService->verifyOtp($data['username'], $data['otp_code'], $data['userType']);
        Auth::startSession();
        Auth::login($result['user'], $data['userType']);
        
        $public_user = $result['user'];
        $public_user['userType'] = $data['userType'];
        unset($public_user['password'], $public_user['otp_code'], $public_user['otp_expires_at'], $public_user['reset_token'], $public_user['reset_expires_at']);

        Response::success(
            \Constants\AppMessages::SUCCESS_VERIFY_OTP,
            ['user' => $public_user]
        );
    }

    public function logout(): void {
        Auth::logout();
        Response::success(\Constants\AppMessages::SUCCESS_LOGOUT);
    }
}
