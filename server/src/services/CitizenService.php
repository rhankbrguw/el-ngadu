<?php

namespace Services;

use Repositories\CitizenRepository;
use Core\NotFoundException;
use Core\ValidationException;
use Constants\AppMessages;
use Components\NotificationManager;

/**
 * Service for handling Citizen (Masyarakat) logic
 */
class CitizenService {
    
    private CitizenRepository $repository;
    
    public function __construct() {
        $this->repository = new CitizenRepository();
    }
    
    public function getAll(int $page = 1, ?int $limit = null): array {
        $limit = $limit ?? \Constants\Config::DEFAULT_PAGINATION_LIMIT;
        $offset = ($page - 1) * $limit;
        $totalRecords = $this->repository->getCount();
        $totalPages = (int)ceil($totalRecords / $limit);
        $masyarakat = $this->repository->getPaginated($limit, $offset);

        return [
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $totalRecords,
                'limit' => $limit
            ],
            'data' => $masyarakat
        ];
    }

    public function update(string $nik, array $data): void {
        $fields = [];
        $params = [];

        if (isset($data['nama'])) {
            $fields[] = 'nama = ?';
            $params[] = trim($data['nama']);
        }
        if (isset($data['username'])) {
            $fields[] = 'username = ?';
            $params[] = trim($data['username']);
        }
        if (isset($data['telp'])) {
            $fields[] = 'telp = ?';
            $params[] = trim($data['telp']);
        }

        if (empty($fields)) {
            throw new ValidationException(AppMessages::ERR_NO_DATA_UPDATE);
        }

        try {
            $this->repository->beginTransaction();

            if (!$this->repository->findById($nik)) {
                throw new NotFoundException(AppMessages::ERR_ACCOUNT_NOT_FOUND);
            }

            $this->repository->update($nik, $fields, $params);
            NotificationManager::create($nik, 'masyarakat', AppMessages::NOTIF_PROFILE_UPDATED_BY_ADMIN, AppMessages::ROUTE_DASHBOARD_PROFILE);

            $this->repository->commit();
        } catch (\Throwable $e) {
            $this->repository->rollBack();
            throw $e;
        }
    }

    public function delete(string $nik): void {
        $rowCount = $this->repository->delete($nik);
        if ($rowCount === 0) {
            throw new NotFoundException(AppMessages::ERR_ACCOUNT_NOT_FOUND);
        }
    }

    public function search(string $query): array {
        $searchQuery = '%' . $query . '%';
        return $this->repository->search($searchQuery);
    }
}
