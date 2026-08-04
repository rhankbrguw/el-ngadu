<?php

namespace Services;

use Repositories\OfficerRepository;
use Components\NotificationManager;
use Components\EmailService;
use Core\ForbiddenException;
use Core\NotFoundException;
use Constants\AppMessages;

/**
 * Service for handling Officer (Petugas/Admin) business logic
 */
class OfficerService {
    
    private OfficerRepository $repository;
    
    public function __construct() {
        $this->repository = new OfficerRepository();
    }

    public function getAllOfficers(int $page, int $limit): array {
        $offset = ($page - 1) * $limit;
        $totalRecords = $this->repository->getCount();
        $totalPages = (int)ceil($totalRecords / $limit);
        $petugas = $this->repository->getPaginated($limit, $offset);
        
        return [
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $totalRecords,
                'limit' => $limit
            ],
            'data' => $petugas
        ];
    }

    public function createOfficer(array $data): void {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        
        try {
            $this->repository->beginTransaction();
            $newId = $this->repository->create($data);
            
            NotificationManager::create((string)$newId, 'petugas', AppMessages::NOTIF_WELCOME_OFFICER, AppMessages::ROUTE_DASHBOARD);
            $this->repository->commit();
        } catch (\Throwable $e) {
            $this->repository->rollBack();
            throw $e;
        }

        if (!empty($data['email'])) {
            $content = sprintf(AppMessages::EMAIL_CONTENT_WELCOME_OFFICER, htmlspecialchars($data['nama_petugas']), htmlspecialchars($data['username']), ucfirst($data['level']));
            $appUrl = \Constants\Config::getAppUrl();
            EmailService::getInstance()->sendEmailAsync($data['email'], AppMessages::EMAIL_SUBJECT_WELCOME_OFFICER, AppMessages::EMAIL_TITLE_WELCOME_OFFICER, $content, AppMessages::EMAIL_BTN_LOGIN, rtrim($appUrl, '/') . '/login');
        }
    }

    private function buildUpdateFields(array $data): array {
        $fields = [];
        $params = [];
        $allowedFields = ['nama_petugas', 'username', 'telp', 'email', 'level'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        return [$fields, $params];
    }

    public function updateOfficer(int $id, array $data): void {
        [$fields, $params] = $this->buildUpdateFields($data);
        if (empty($fields)) {
            return;
        }

        try {
            $this->repository->beginTransaction();
            if (!$this->repository->findById($id)) {
                throw new NotFoundException(AppMessages::ERR_PETUGAS_TIDAK_DITEMUKAN);
            }
            
            $this->repository->update($id, $fields, $params);
            NotificationManager::create((string)$id, 'petugas', AppMessages::NOTIF_PROFILE_UPDATED_BY_ADMIN, AppMessages::ROUTE_DASHBOARD_PROFILE);
            $this->repository->commit();
        } catch (\Throwable $e) {
            $this->repository->rollBack();
            throw $e;
        }
    }

    public function deleteOfficer(int $id, int|string|null $currentUserId = null): void {
        if ($currentUserId !== null && (int)$id === (int)$currentUserId) {
            throw new ForbiddenException(AppMessages::ERR_ADMIN_DELETE_SELF);
        }
        
        $rowCount = $this->repository->delete($id);
        if ($rowCount === 0) {
            throw new NotFoundException(AppMessages::ERR_PETUGAS_TIDAK_DITEMUKAN);
        }
    }

    public function searchOfficers(string $query): array {
        $searchTerm = '%' . $query . '%';
        return $this->repository->search($searchTerm);
    }
}

