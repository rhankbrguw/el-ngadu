<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Constants\AppMessages;
use Components\Auth;
use Services\CitizenRegistrationService;
use Rakit\Validation\Validator;

class CitizenRegistrationController {
    
    private CitizenRegistrationService $registrationService;
    
    public function __construct() {
        $this->registrationService = new CitizenRegistrationService();
    }

    public function register(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'nik' => 'required',
            'nama' => 'required',
            'username' => 'required',
            'email' => 'required|email',
            'telp' => 'required',
            'password' => 'required'
        ]);
        
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        
        $result = $this->registrationService->register($data);

        if ($result['is_admin']) {
            Auth::startSession();
            Auth::login($result['user'], 'petugas');
            
            Response::json([
                'bypass_otp' => true,
                'message' => \Constants\AppMessages::SUCCESS_SETUP_WIZARD,
                'user' => $result['user']
            ]);
        } else {
            Response::json([
                'requires_otp' => true,
                'username' => $result['username'],
                'userType' => $result['userType'],
                'message' => \Constants\AppMessages::SUCCESS_REGISTER
            ]);
        }
    }
}
