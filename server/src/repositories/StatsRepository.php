<?php

namespace Repositories;

use Components\Database;
use PDO;

class StatsRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function getPengaduanStats(): array {
        $sql = "
            SELECT
                COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
                COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
                COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai
            FROM pengaduan
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getCount(string $table): int {
        return (int)$this->pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    }

    public function getCountByStatus(string $table, string $statusCol, string $statusVal): int {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE {$statusCol} = ?");
        $stmt->execute([$statusVal]);
        return (int)$stmt->fetchColumn();
    }
}
