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

    public function beginTransaction(): void { $this->pdo->beginTransaction(); }
    public function commit(): void { $this->pdo->commit(); }
    public function rollBack(): void { if ($this->pdo->inTransaction()) { $this->pdo->rollBack(); } }

    private function buildFilterClause(?string $status, ?string $kecamatan, ?string $q, array &$params): string {
        $sql = "";
        if ($status && $status !== 'all') { $sql .= " AND p.status = ?"; $params[] = $status; }
        if ($kecamatan && $kecamatan !== 'all') { $sql .= " AND p.kecamatan = ?"; $params[] = $kecamatan; }
        if ($q && trim($q) !== '') {
            $sql .= " AND (p.judul LIKE ? OR p.isi LIKE ? OR p.lokasi LIKE ? OR p.kecamatan LIKE ? OR m.nama LIKE ?)";
            $term = "%" . trim($q) . "%";
            $params = array_merge($params, [$term, $term, $term, $term, $term]);
        }
        return $sql;
    }

    public function getCount(?string $status = null, ?string $kecamatan = null, ?string $q = null): int {
        $params = [];
        $where = $this->buildFilterClause($status, $kecamatan, $q, $params);
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE 1=1$where");
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    public function getAll(int $limit, int $offset, ?string $status = null, ?string $kecamatan = null, ?string $q = null): array {
        $params = [];
        $where = $this->buildFilterClause($status, $kecamatan, $q, $params);
        $sql = "SELECT p.id, p.judul, p.status, p.kategori, p.prioritas, p.kecamatan, p.kelurahan, p.lokasi, p.created_at,
                CASE WHEN p.is_anonim = 1 THEN 'Masyarakat (Anonim)' ELSE m.nama END AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE 1=1$where
                ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $i => $v) { $stmt->bindValue($i + 1, $v, is_int($v) ? PDO::PARAM_INT : PDO::PARAM_STR); }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDistinctKecamatan(): array {
        $sql = "SELECT DISTINCT kecamatan FROM pengaduan WHERE kecamatan IS NOT NULL AND kecamatan != '' ORDER BY kecamatan ASC";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_COLUMN) ?: [];
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
        $sql = "SELECT p.*, CASE WHEN p.is_anonim = 1 THEN 'Masyarakat (Anonim)' ELSE m.nama END AS nama_pelapor,
                CASE WHEN p.is_anonim = 1 THEN NULL ELSE m.email END AS email_pelapor,
                t.id_tanggapan, t.tgl_tanggapan, t.isi_tanggapan, pt.nama_petugas AS nama_penanggap
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik
                LEFT JOIN tanggapan t ON p.id = t.id_pengaduan LEFT JOIN petugas pt ON t.id_petugas = pt.id_petugas
                WHERE p.id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function search(string $q, ?string $userNik): array {
        $sql = "SELECT p.id, p.judul, p.status, p.kategori, p.prioritas, p.kecamatan, p.kelurahan, p.created_at,
                CASE WHEN p.is_anonim = 1 THEN 'Masyarakat (Anonim)' ELSE m.nama END AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik 
                WHERE (p.judul LIKE ? OR p.isi LIKE ? OR p.kategori LIKE ? OR p.lokasi LIKE ? OR p.kecamatan LIKE ? OR p.kelurahan LIKE ? OR m.nama LIKE ?)";
        $term = "%$q%";
        $params = [$term, $term, $term, $term, $term, $term, $term];
        if ($userNik) { $sql .= " AND p.nik_masyarakat = ?"; $params[] = $userNik; }
        $sql .= " ORDER BY p.created_at DESC LIMIT 50";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getStatsMine(string $nik): array {
        $sql = "SELECT COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
            COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai, COUNT(*) AS total
            FROM pengaduan WHERE nik_masyarakat = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$nik]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createComplaint(array $data, string $userId, ?string $fotoPath): int {
        $cols = "judul, isi, kategori, lokasi, kecamatan, kelurahan, tanggal_kejadian, prioritas, is_anonim, nik_masyarakat, foto_bukti";
        $stmt = $this->pdo->prepare("INSERT INTO pengaduan ($cols) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['judul'], $data['isi'], $data['kategori'], $data['lokasi'],
            $data['kecamatan'] ?? null, $data['kelurahan'] ?? null,
            $data['tanggal_kejadian'] ?? null, $data['prioritas'] ?? 'sedang',
            !empty($data['is_anonim']) ? 1 : 0, $userId, $fotoPath
        ]);
        return (int)$this->pdo->lastInsertId();
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
        $stmt = $this->pdo->prepare("UPDATE pengaduan SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    public function deleteComplaint(int $id): int {
        $stmt = $this->pdo->prepare("DELETE FROM pengaduan WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }
}

