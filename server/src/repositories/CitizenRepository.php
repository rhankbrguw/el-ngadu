<?php

namespace Repositories;

use Components\Database;
use PDO;

class CitizenRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function getPdo(): PDO {
        return $this->pdo;
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

    public function getAdminCount(): int {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM petugas WHERE level = 'admin'");
        return (int)$stmt->fetchColumn();
    }

    public function createAdmin(array $data): int {
        try {
            $sql = "INSERT INTO petugas (nama_petugas, username, password, email, telp, level, is_verified) VALUES (?, ?, ?, ?, ?, 'admin', 1)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['nama'], 
                $data['username'], 
                $data['password'], 
                $data['email'], 
                $data['telp']
            ]);
            return (int)$this->pdo->lastInsertId();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException(\Constants\AppMessages::ERR_NIK_ATAU_USERNAME_SUDAH_TERDAFTAR ?? 'NIK atau Username sudah terdaftar.');
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function createCitizen(array $data): void {
        try {
            $sql = "INSERT INTO masyarakat (nik, nama, username, password, email, telp) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['nik'],
                $data['nama'],
                $data['username'],
                $data['password'],
                $data['email'],
                $data['telp']
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException('NIK atau Username sudah terdaftar.');
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function getCount(): int {
        try {
            $stmt = $this->pdo->query("SELECT COUNT(*) FROM masyarakat");
            return (int)$stmt->fetchColumn();
        } catch (\PDOException $e) {
            throw new \Core\BaseException('Gagal mengambil data masyarakat: ' . $e->getMessage(), 500);
        }
    }

    public function getPaginated(int $limit, int $offset): array {
        try {
            $sql = "SELECT nik, nama, username, telp, created_at FROM masyarakat ORDER BY nama ASC LIMIT :limit OFFSET :offset";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Core\BaseException('Gagal mengambil data masyarakat: ' . $e->getMessage(), 500);
        }
    }

    public function findById(string $nik): ?array {
        $stmt = $this->pdo->prepare("SELECT nik FROM masyarakat WHERE nik = ?");
        $stmt->execute([$nik]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function update(string $nik, array $fields, array $params): void {
        try {
            $sql = "UPDATE masyarakat SET " . implode(', ', $fields) . " WHERE nik = ?";
            $params[] = $nik;
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException('Username sudah terdaftar.');
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function delete(string $nik): int {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM masyarakat WHERE nik = ?");
            $stmt->execute([$nik]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            throw new \Core\BaseException('Gagal menghapus data masyarakat: ' . $e->getMessage(), 500);
        }
    }

    public function search(string $searchTerm): array {
        try {
            $sql = "SELECT nik, nama, username, telp, created_at FROM masyarakat WHERE nama LIKE ? OR username LIKE ? OR nik LIKE ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Core\BaseException('Gagal melakukan pencarian: ' . $e->getMessage(), 500);
        }
    }
}
