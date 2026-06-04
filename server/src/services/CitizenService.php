<?php

namespace Services;

use Components\Database;
use Core\BaseException;
use Core\ConflictException;
use Core\NotFoundException;
use Core\ValidationException;
use Core\Messages;
use Components\NotificationManager;

/**
 * Service for handling Citizen (Masyarakat) logic
 */
class CitizenService {
    
    public function getAll(int $page = 1, int $limit = 10): array {
        $pdo = Database::connect();
        $offset = ($page - 1) * $limit;

        try {
            $totalQuery = $pdo->query("SELECT COUNT(*) FROM masyarakat");
            $total_records = $totalQuery->fetchColumn();
            $total_pages = ceil($total_records / $limit);

            $sql = "SELECT nik, nama, username, telp, created_at FROM masyarakat ORDER BY nama ASC LIMIT :limit OFFSET :offset";
            $statement = $pdo->prepare($sql);
            $statement->bindParam(':limit', $limit, \PDO::PARAM_INT);
            $statement->bindParam(':offset', $offset, \PDO::PARAM_INT);
            $statement->execute();

            $masyarakat = $statement->fetchAll(\PDO::FETCH_ASSOC);

            return [
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => (int)$total_pages,
                    'total_records' => (int)$total_records,
                    'limit' => $limit
                ],
                'data' => $masyarakat
            ];
        } catch (\PDOException $e) {
            throw new BaseException('Gagal mengambil data masyarakat: ' . $e->getMessage(), 500);
        }
    }

    public function update(string $nik, array $data): void {
        $pdo = Database::connect();
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
            throw new ValidationException(Messages::ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB);
        }

        $params[] = $nik;

        try {
            $pdo->beginTransaction();

            $check = $pdo->prepare("SELECT nik FROM masyarakat WHERE nik = ?");
            $check->execute([$nik]);
            if (!$check->fetch()) {
                throw new NotFoundException(Messages::ERR_MASYARAKAT_TIDAK_DITEMUKAN_ATAU_DATA_TID);
            }

            $sql = "UPDATE masyarakat SET " . implode(', ', $fields) . " WHERE nik = ?";
            $statement = $pdo->prepare($sql);
            $statement->execute($params);

            $message = "Data profil Anda telah diperbarui oleh admin.";
            $link = "/dashboard/profile";
            NotificationManager::create($pdo, $nik, 'masyarakat', $message, $link);

            $pdo->commit();
        } catch (\PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            if ($e->getCode() === '23000') {
                throw new ConflictException(Messages::ERR_USERNAME_SUDAH_DIGUNAKAN);
            } else {
                throw new BaseException('Gagal memperbarui data: ' . $e->getMessage(), 500);
            }
        }
    }

    public function delete(string $nik): void {
        $pdo = Database::connect();
        
        try {
            $sql = "DELETE FROM masyarakat WHERE nik = ?";
            $statement = $pdo->prepare($sql);
            $statement->execute([$nik]);

            if ($statement->rowCount() === 0) {
                throw new NotFoundException(Messages::ERR_AKUN_MASYARAKAT_TIDAK_DITEMUKAN);
            }
        } catch (\PDOException $e) {
            throw new BaseException('Gagal menghapus data: ' . $e->getMessage(), 500);
        }
    }

    public function search(string $query): array {
        $pdo = Database::connect();
        $searchQuery = '%' . $query . '%';

        try {
            $sql = "SELECT nik, nama, username, telp, created_at FROM masyarakat WHERE nama LIKE ? OR username LIKE ? OR nik LIKE ?";
            $statement = $pdo->prepare($sql);
            $statement->execute([$searchQuery, $searchQuery, $searchQuery]);
            return $statement->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new BaseException('Gagal melakukan pencarian: ' . $e->getMessage(), 500);
        }
    }
}
