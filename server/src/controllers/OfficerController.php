<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Constants\AppMessages;
use Components\Auth;
use Services\OfficerService;
use Rakit\Validation\Validator;

/**
 * Controller for managing officers (petugas & admin)
 */
class OfficerController {
    
    private OfficerService $officerService;
    
    public function __construct() {
        $this->officerService = new OfficerService();
    }
    
    /**
     * Enforce admin-only access
     */
    private function requireAdmin(): void {
        Auth::startSession();
        // Allow access only if logged in, is a petugas (or admin), and has the 'admin' level
        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
    }

    /**
     * Get all officers with pagination
     * Route: GET /api/officers
     */
    public function readAll(): void {
        $this->requireAdmin();
        
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $result = $this->officerService->getAllOfficers($page, $limit);
        
        Response::json($result);
    }
    
    /**
     * Update an existing officer
     * Route: PUT /api/officers?id={id}
     */
    public function update(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['id'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['id' => AppMessages::ERR_ID_REQUIRED]);
        }
        
        $id = (int)$_GET['id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new Validator();
        $validation = $validator->make($input, [
            'nama_petugas' => 'min:3',
            'username'     => 'min:3',
            'password'     => 'min:8',
            'telp'         => 'min:5',
            'level'        => 'in:admin,petugas',
            'email'        => 'email'
        ]);
        
        $validation->validate();
        
        if ($validation->fails()) {
            $errors = $validation->errors()->firstOfAll();
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $errors);
        }
        
        $data = $validation->getValidData();
        if (empty($data)) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['data' => AppMessages::ERR_NO_DATA_UPDATE]);
        }
        
        $this->officerService->updateOfficer($id, $data);
        
        Response::json(['message' => 'Data petugas berhasil diperbarui']);
    }
    
    /**
     * Delete an existing officer
     * Route: DELETE /api/officers?id={id}
     */
    public function delete(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['id'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['id' => AppMessages::ERR_ID_REQUIRED]);
        }
        
        $id = (int)$_GET['id'];
        
        if ($id == Auth::getUserId()) {
            throw new UnauthorizedException(AppMessages::ERR_ADMIN_DELETE_SELF);
        }
        
        $this->officerService->deleteOfficer($id);
        
        Response::json(['message' => 'Akun petugas berhasil dihapus']);
    }
    
    /**
     * Search officers by name or username
     * Route: GET /api/officers/search?q={query}
     */
    public function search(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['q'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['q' => AppMessages::ERR_QUERY_REQUIRED]);
        }
        
        $query = $_GET['q'];
        
        $results = $this->officerService->searchOfficers($query);
        
        Response::json($results);
    }
}
