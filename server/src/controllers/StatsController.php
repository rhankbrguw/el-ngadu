<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Services\StatsService;
use Constants\AppMessages;
use Constants\Roles;

class StatsController {
    private StatsService $statsService;

    public function __construct() {
        $this->statsService = new StatsService();
    }

    public function getAdminStats(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }

        if (!in_array($_SESSION['level'] ?? '', [Roles::ADMIN, Roles::PETUGAS], true)) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $stats = $this->statsService->getAdminStats();
        Response::success(AppMessages::SUCCESS_OPERATION, $stats);
    }

    public function getPublicStats(): void {
        $stats = $this->statsService->getPublicStats();
        Response::success(AppMessages::SUCCESS_OPERATION, $stats);
    }
}
