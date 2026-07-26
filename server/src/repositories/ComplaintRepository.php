<?php

namespace Repositories;

use Components\Database;
use PDO;

class ComplaintRepository {
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

    public function getCount(): int {
        return (int)$this->pdo->query("SELECT COUNT(*) FROM pengaduan")->fetchColumn();
    }

    public function getAll(int $limit, int $offset): array {
        $sql = "SELECT p.id, p.judul, p.status, p.created_at, m.nama AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik
                ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCountMine(string $nik): int {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM pengaduan WHERE nik_masyarakat = ?");
        $stmt->execute([$nik]);
        return (int)$stmt->fetchColumn();
    }

    public function getMine(string $nik, int $limit, int $offset): array {
        $sql = "SELECT * FROM pengaduan WHERE nik_masyarakat = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(1, $nik, PDO::PARAM_STR);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOne(int $id): ?array {
        $sql = "SELECT p.*, m.nama AS nama_pelapor, m.email AS email_pelapor, t.id_tanggapan, t.tgl_tanggapan, t.isi_tanggapan, pt.nama_petugas AS nama_penanggap
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik
                LEFT JOIN tanggapan t ON p.id = t.id_pengaduan
                LEFT JOIN petugas pt ON t.id_petugas = pt.id_petugas
                WHERE p.id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function search(string $q, ?string $userNik): array {
        $sql = "SELECT p.id, p.judul, p.status, p.created_at, m.nama AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.judul LIKE ?";
        $params = ["%$q%"];
        
        if ($userNik) {
            $sql .= " AND p.nik_masyarakat = ?";
            $params[] = $userNik;
        }
        $sql .= " ORDER BY p.created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getStatsMine(string $nik): array {
        $sql = "SELECT
            COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
            COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai,
            COUNT(*) AS total
            FROM pengaduan WHERE nik_masyarakat = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$nik]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createComplaint(array $data, string $userId, ?string $fotoPath): int {
        try {
            $sql = "INSERT INTO pengaduan (judul, isi, kategori, lokasi, nik_masyarakat, foto_bukti) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$data['judul'], $data['isi'], $data['kategori'], $data['lokasi'], $userId, $fotoPath]);
            return (int)$this->pdo->lastInsertId();
        } catch (\PDOException $e) {
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function getOfficers(): array {
        return $this->pdo->query("SELECT id_petugas, email FROM petugas")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getComplaintDetailsForUpdate(int $id): ?array {
        $stmt = $this->pdo->prepare("SELECT p.nik_masyarakat, p.judul, m.nama, m.email FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateStatus(int $id, string $status): void {
        try {
            $stmt = $this->pdo->prepare("UPDATE pengaduan SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
        } catch (\PDOException $e) {
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function deleteComplaint(int $id): int {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM pengaduan WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            throw new \Core\BaseException('Gagal menghapus pengaduan: ' . $e->getMessage(), 500);
        }
    }
}
