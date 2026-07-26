<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Core\ValidationException;
use Constants\AppMessages;
use Constants\Roles;
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
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (Auth::getUserType() !== Roles::PETUGAS || ($_SESSION['level'] ?? '') !== Roles::ADMIN) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }
    }

    public function readAll(): void {
        $this->requireAdmin();
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $result = $this->officerService->getAllOfficers($page, $limit);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $result);
    }
    
    private function validateUpdateInput(array $input): array {
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
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        $data = $validation->getValidData();
        if (empty($data)) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['data' => AppMessages::ERR_NO_DATA_UPDATE]);
        }
        return $data;
    }

    public function updateOfficer(): void {
        $this->requireAdmin();
        if (!isset($_GET['id'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['id' => AppMessages::ERR_ID_REQUIRED]);
        }
        
        $id = (int)$_GET['id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = $this->validateUpdateInput($input);
        
        $this->officerService->updateOfficer($id, $data);
        Response::success(AppMessages::SUCCESS_UPDATE_OFFICER);
    }
    
    public function deleteOfficer(): void {
        $this->requireAdmin();
        if (!isset($_GET['id'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['id' => AppMessages::ERR_ID_REQUIRED]);
        }
        
        $id = (int)$_GET['id'];
        $this->officerService->deleteOfficer($id, Auth::getUserId());
        Response::success(AppMessages::SUCCESS_DELETE_OFFICER);
    }
    
    public function searchOfficers(): void {
        $this->requireAdmin();
        if (!isset($_GET['q'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['q' => AppMessages::ERR_QUERY_REQUIRED]);
        }
        
        $results = $this->officerService->searchOfficers($_GET['q']);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $results);
    }
}
