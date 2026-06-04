<?php

namespace Services;

use Components\Database;

class StatsService {
    public function getAdminStats(): array {
        $pdo = Database::connect();
        
        $pengaduanSql = "
            SELECT
                COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
                COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
                COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai
            FROM pengaduan
        ";
        $pengaduanStmt = $pdo->query($pengaduanSql);
        $pengaduanStats = $pengaduanStmt->fetch(\PDO::FETCH_ASSOC);

        $masyarakatCount = (int)$pdo->query("SELECT COUNT(*) FROM masyarakat")->fetchColumn();
        $petugasCount = (int)$pdo->query("SELECT COUNT(*) FROM petugas")->fetchColumn();

        return [
            'pengaduan_diajukan' => (int)$pengaduanStats['diajukan'],
            'pengaduan_diproses' => (int)$pengaduanStats['diproses'],
            'pengaduan_selesai' => (int)$pengaduanStats['selesai'],
            'total_masyarakat' => $masyarakatCount,
            'total_petugas' => $petugasCount
        ];
    }

    public function getPublicStats(): array {
        $pdo = Database::connect();
        
        $total = (int)$pdo->query("SELECT COUNT(*) FROM pengaduan")->fetchColumn();
        $proses = (int)$pdo->query("SELECT COUNT(*) FROM pengaduan WHERE status = 'diproses'")->fetchColumn();
        $selesai = (int)$pdo->query("SELECT COUNT(*) FROM pengaduan WHERE status = 'selesai'")->fetchColumn();

        return [
            'total' => $total,
            'proses' => $proses,
            'selesai' => $selesai,
        ];
    }
}
