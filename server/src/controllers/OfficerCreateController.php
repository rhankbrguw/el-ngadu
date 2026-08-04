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
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (Auth::getUserType() !== \Constants\Roles::PETUGAS || $_SESSION['level'] !== \Constants\Roles::ADMIN) {
            throw new \Core\ForbiddenException(\Constants\AppMessages::ERR_FORBIDDEN);
        }
    }

    public function createOfficer(): void {
        $this->requireAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validation = \Core\AppValidator::make($input, [
            'nama_petugas' => 'required|min:3',
            'username'     => 'required|min:3|unique_global',
            'password'     => 'required|min:8',
            'telp'         => 'required|unique_global',
            'level'        => 'required|in:admin,petugas',
            'email'        => 'email|unique_global'
        ]);
        
        $validation->validate();
        
        if ($validation->fails()) {
            $errors = $validation->errors()->firstOfAll();
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $errors);
        }
        
        $this->officerService->createOfficer($validation->getValidData());
        
        Response::success(\Constants\AppMessages::SUCCESS_CREATE_OFFICER);
    }
}
