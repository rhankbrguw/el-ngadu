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
        if (empty($input['username']) || empty($input['password'])) {
            throw new ValidationException(\Core\Messages::AUTH_MISSING_CREDENTIALS);
        }
        $result = $this->authService->legacyLogin($input['username'], $input['password']);
        Auth::startSession();
        Auth::login($result['user'], 'masyarakat');
        Response::success(\Core\Messages::AUTH_LOGIN_SUCCESS, ['user' => $result['public_user']]);
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
            Response::json($result);
            return;
        }

        Auth::startSession();
        Auth::login($result['user'], $result['type']);
        
        Response::json([
            'message' => \Constants\AppMessages::SUCCESS_LOGIN,
            'user' => $result['user']
        ]);
    }

    public function verifyOtp(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!isset($input['username'], $input['otp_code'], $input['userType'])) {
            throw new ValidationException("Username, kode OTP, dan tipe pengguna wajib diisi.");
        }
        
        $result = $this->authService->verifyOtp($input['username'], $input['otp_code'], $input['userType']);
        Auth::startSession();
        Auth::login($result['user'], $input['userType']);
        
        $public_user = $result['user'];
        $public_user['userType'] = $input['userType'];
        unset($public_user['password'], $public_user['otp_code'], $public_user['otp_expires_at'], $public_user['reset_token'], $public_user['reset_expires_at']);

        Response::json([
            'message' => \Constants\AppMessages::SUCCESS_VERIFY_OTP,
            'user' => $public_user
        ]);
    }

    public function logout(): void {
        Auth::logout();
        Response::json(['message' => \Constants\AppMessages::SUCCESS_LOGOUT]);
    }
}
