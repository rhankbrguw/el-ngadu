<?php

namespace Repositories;

use Components\Database;
use PDO;

class ReportRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function getFullReport(): array {
        $statement = $this->pdo->query($this->getFullReportQuery());
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getFullReportQuery(): string {
        return "SELECT
                p.id, p.judul, p.isi, p.kategori, p.lokasi, p.kecamatan, p.kelurahan, p.prioritas, p.status,
                p.created_at AS tgl_pengaduan, m.nik AS nik_pelapor,
                CASE WHEN p.is_anonim = 1 THEN 'Masyarakat (Anonim)' ELSE m.nama END AS nama_pelapor,
                t.id_tanggapan, t.tgl_tanggapan, t.isi_tanggapan, pt.nama_petugas AS nama_petugas_penanggap
            FROM pengaduan p
            JOIN masyarakat m ON p.nik_masyarakat = m.nik
            LEFT JOIN tanggapan t ON p.id = t.id_pengaduan
            LEFT JOIN petugas pt ON t.id_petugas = pt.id_petugas
            ORDER BY p.created_at DESC";
    }

}

