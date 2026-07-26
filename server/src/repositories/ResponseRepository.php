<?php

namespace Repositories;

use Components\Database;
use PDO;

class ResponseRepository {
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

    public function createResponse(int $idPengaduan, string $idPetugas, string $isiTanggapan): void {
        $sql = "INSERT INTO tanggapan (id_pengaduan, id_petugas, isi_tanggapan) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idPengaduan, $idPetugas, $isiTanggapan]);
    }

    public function getComplaintDetailsForResponse(int $idPengaduan): ?array {
        $stmt = $this->pdo->prepare("SELECT p.nik_masyarakat, p.judul, m.nama, m.email FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.id = ?");
        $stmt->execute([$idPengaduan]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateComplaintStatus(int $idPengaduan, string $status): void {
        $sql = "UPDATE pengaduan SET status = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$status, $idPengaduan]);
    }
}
