<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Constants\AppMessages;
use Constants\Roles;
use Components\Auth;
use Services\CitizenService;
use Rakit\Validation\Validator;

/**
 * Controller for managing Citizens (Masyarakat)
 */
class CitizenController {
    
    private CitizenService $citizenService;
    
    public function __construct() {
        $this->citizenService = new CitizenService();
    }

    /**
     * Check if the current user is an admin
     */
    private function requireAdmin(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (($_SESSION['level'] ?? '') !== Roles::ADMIN) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }
    }

    /**
     * Get all citizens
     */
    public function getAll(): void {
        $this->requireAdmin();
        
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $result = $this->citizenService->getAll($page, $limit);
        Response::success(AppMessages::SUCCESS_OPERATION, $result);
    }

    /**
     * Update an existing citizen
     */
    public function updateCitizen(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['nik'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['nik' => 'NIK wajib ada']);
        }
        
        $nik = $_GET['nik'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'nama' => 'sometimes|required',
            'username' => 'sometimes|required',
            'telp' => 'sometimes|required'
        ]);

        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        
        $data = $validation->getValidData();
        if (empty($data)) {
            throw new ValidationException(AppMessages::ERR_NO_DATA_UPDATE);
        }

        $this->citizenService->update($nik, $data);
        Response::success(AppMessages::SUCCESS_UPDATE_CITIZEN);
    }

    /**
     * Delete a citizen
     */
    public function deleteCitizen(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['nik']) || empty(trim($_GET['nik']))) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['nik' => 'NIK wajib ada']);
        }
        
        $nik = $_GET['nik'];
        $this->citizenService->delete($nik);
        Response::success(AppMessages::SUCCESS_DELETE_CITIZEN);
    }

    /**
     * Search citizens
     */
    public function searchCitizens(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['q']) || empty(trim($_GET['q']))) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['q' => AppMessages::ERR_QUERY_REQUIRED]);
        }
        
        $results = $this->citizenService->search($_GET['q']);
        Response::success(AppMessages::SUCCESS_OPERATION, $results);
    }
}
