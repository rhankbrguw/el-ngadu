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



    public function unifiedLogin(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = $this->validateLoginInput($input);
        $result = $this->authService->unifiedLogin($data['username'], $data['password']);

        if (!empty($result['requires_otp'])) {
            Response::success(AppMessages::MSG_OTP_REQUIRED, $result);
            return;
        }

        Auth::startSession();
        Auth::login($result['user'], $result['type']);

        Response::success(
            AppMessages::SUCCESS_LOGIN,
            ['user' => $this->sanitizeUser($result['user'])]
        );
    }

    public function verifyOtp(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = $this->validateOtpInput($input);
        
        $result = $this->authService->verifyOtp($data['username'], $data['otp_code'], $data['userType']);
        Auth::startSession();
        Auth::login($result['user'], $data['userType']);
        
        $public_user = $this->sanitizeUser($result['user']);
        $public_user['userType'] = $data['userType'];

        Response::success(
            AppMessages::SUCCESS_VERIFY_OTP,
            ['user' => $public_user]
        );
    }

    public function logout(): void {
        Auth::logout();
        Response::success(AppMessages::SUCCESS_LOGOUT);
    }

    private function validateLoginInput(array $input): array {
        $validator = new Validator();
        $validation = $validator->make($input, [
            'username' => 'required',
            'password' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        return $validation->getValidData();
    }

    private function validateOtpInput(array $input): array {
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
        return $validation->getValidData();
    }

    private function sanitizeUser(array $user): array {
        unset(
            $user['password'],
            $user['otp_code'],
            $user['otp_expires_at'],
            $user['reset_token'],
            $user['reset_expires_at']
        );
        return $user;
    }
}

