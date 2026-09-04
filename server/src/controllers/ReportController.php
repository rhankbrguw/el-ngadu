<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Services\ReportService;
use Constants\AppMessages;
use Constants\Roles;

class ReportController {
    private ReportService $reportService;

    public function __construct() {
        $this->reportService = new ReportService();
    }

    public function generateReport(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }

        if (Auth::getUserType() !== Roles::PETUGAS || ($_SESSION['level'] ?? '') !== Roles::ADMIN) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $laporan = $this->reportService->generateReport();
        Response::success(AppMessages::SUCCESS_OPERATION, $laporan);
    }
}
