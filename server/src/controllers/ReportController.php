<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\BaseException;
use Services\ReportService;

class ReportController {
    private ReportService $reportService;

    public function __construct() {
        $this->reportService = new ReportService();
    }

    public function generate(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || ($_SESSION['level'] ?? '') !== 'admin') {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEM ?? 'Akses ditolak.');
        }

        try {
            $laporan = $this->reportService->generateReport();
            Response::json($laporan);
        } catch (\PDOException $e) {
            throw new BaseException('Gagal membuat laporan: ' . $e->getMessage(), 500);
        }
    }
}
