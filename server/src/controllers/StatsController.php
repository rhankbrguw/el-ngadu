<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\BaseException;
use Services\StatsService;

class StatsController {
    private StatsService $statsService;

    public function __construct() {
        $this->statsService = new StatsService();
    }

    public function admin(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn() || !in_array($_SESSION['level'] ?? '', ['admin', 'petugas'])) {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_BISA_MENG ?? 'Akses ditolak.');
        }

        try {
            $stats = $this->statsService->getAdminStats();
            Response::json($stats);
        } catch (\PDOException $e) {
            throw new BaseException('Gagal mengambil data statistik admin: ' . $e->getMessage(), 500);
        }
    }

    public function read(): void {
        try {
            $stats = $this->statsService->getPublicStats();
            Response::json($stats);
        } catch (\PDOException $e) {
            throw new BaseException('Gagal mengambil data statistik: ' . $e->getMessage(), 500);
        }
    }
}
