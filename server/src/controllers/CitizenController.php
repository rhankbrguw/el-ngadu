<?php

namespace Controllers;

use Core\Response;
use Core\ValidationException;
use Core\UnauthorizedException;
use Core\Messages;
use Constants\AppMessages;
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
        if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED ?? Messages::ERR_AKSES_DITOLAK);
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
        
        Response::json($result);
    }

    /**
     * Update an existing citizen

     */
    public function update(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['nik'])) {
            throw new ValidationException(Messages::ERR_NIK_MASYARAKAT_WAJIB_ADA_DI_URL);
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
            throw new ValidationException(Messages::ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB);
        }

        $this->citizenService->update($nik, $data);
        
        Response::json(['message' => \Constants\AppMessages::SUCCESS_UPDATE_CITIZEN]);
    }

    /**
     * Delete a citizen
     */
    public function delete(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['nik']) || empty(trim($_GET['nik']))) {
            throw new ValidationException(Messages::ERR_NIK_MASYARAKAT_WAJIB_ADA_DI_URL);
        }
        
        $nik = $_GET['nik'];
        
        $this->citizenService->delete($nik);
        
        Response::json(['message' => \Constants\AppMessages::SUCCESS_DELETE_CITIZEN]);
    }

    /**
     * Search citizens
     */
    public function search(): void {
        $this->requireAdmin();
        
        if (!isset($_GET['q']) || empty(trim($_GET['q']))) {
            throw new ValidationException(Messages::ERR_QUERY_PENCARIAN_Q_DIBUTUHKAN);
        }
        
        $query = $_GET['q'];
        
        $results = $this->citizenService->search($query);
        
        Response::json($results);
    }
}
