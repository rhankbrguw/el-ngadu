<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Constants\AppMessages;
use Components\Auth;
use Services\OfficerService;
use Rakit\Validation\Validator;
use Core\UnauthorizedException;

class OfficerCreateController {
    
    private OfficerService $officerService;
    
    public function __construct() {
        $this->officerService = new OfficerService();
    }
    
    private function requireAdmin(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
    }

    public function create(): void {
        $this->requireAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'nama_petugas' => 'required|min:3',
            'username'     => 'required|min:3',
            'password'     => 'required|min:8',
            'telp'         => 'required',
            'level'        => 'required|in:admin,petugas',
            'email'        => 'email'
        ]);
        
        $validation->validate();
        
        if ($validation->fails()) {
            $errors = $validation->errors()->firstOfAll();
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $errors);
        }
        
        $this->officerService->createOfficer($validation->getValidData());
        
        Response::json(['message' => 'Akun petugas baru berhasil dibuat.']);
    }
}
