<?php

namespace Repositories;

use Components\Database;
use PDO;

class OfficerRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function getCount(): int {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM petugas");
        return (int)$stmt->fetchColumn();
    }

    public function getPaginated(int $limit, int $offset): array {
        try {
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas ORDER BY nama_petugas ASC LIMIT :limit OFFSET :offset";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_FETCH_PETUGAS . $e->getMessage(), \Core\Response::HTTP_INTERNAL);
        }
    }

    public function create(array $data): int {
        try {
            $sql = "INSERT INTO petugas (nama_petugas, username, password, telp, level, email) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['nama_petugas'],
                $data['username'],
                $data['password'],
                $data['telp'],
                $data['level'],
                $data['email'] ?? null
            ]);
            return (int)$this->pdo->lastInsertId();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException(\Constants\AppMessages::ERR_USERNAME_SUDAH_TERDAFTAR);
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), \Core\Response::HTTP_INTERNAL);
        }
    }

    public function findById(int $id): ?array {
        $stmt = $this->pdo->prepare("SELECT id_petugas FROM petugas WHERE id_petugas = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function update(int $id, array $fields, array $params): void {
        try {
            $sql = "UPDATE petugas SET " . implode(', ', $fields) . " WHERE id_petugas = ?";
            $params[] = $id;
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException(\Constants\AppMessages::ERR_USERNAME_SUDAH_DIGUNAKAN);
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), \Core\Response::HTTP_INTERNAL);
        }
    }

    public function delete(int $id): int {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM petugas WHERE id_petugas = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_DELETE_PETUGAS . $e->getMessage(), \Core\Response::HTTP_INTERNAL);
        }
    }

    public function search(string $searchTerm): array {
        try {
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas WHERE nama_petugas LIKE ? OR username LIKE ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$searchTerm, $searchTerm]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Core\BaseException(\Constants\AppMessages::ERR_SEARCH_FAILED . $e->getMessage(), \Core\Response::HTTP_INTERNAL);
        }
    }

    public function beginTransaction(): void {
        $this->pdo->beginTransaction();
    }

    public function commit(): void {
        $this->pdo->commit();
    }

    public function rollBack(): void {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }
    
    public function getPdo(): PDO {
        return $this->pdo;
    }
}
