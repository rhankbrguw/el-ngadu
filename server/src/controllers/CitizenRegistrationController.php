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

    public function registerCitizen(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validation = \Core\AppValidator::make($input, [
            'nik' => 'required',
            'nama' => 'required',
            'username' => 'required|unique_global',
            'email' => 'required|email|unique_global',
            'telp' => 'required|unique_global',
            'password' => 'required'
        ]);
        
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        $result = $this->registrationService->register($data);

        if ($result['is_setup_wizard'] && !empty($result['user'])) {
            Auth::startSession();
            Auth::login($result['user'], \Constants\Roles::PETUGAS);
        }

        Response::success($result['message'], $result['response_data']);
    }
}
