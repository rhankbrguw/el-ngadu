<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Core\ValidationException;
use Constants\AppMessages;
use Constants\Roles;
use Components\Auth;
use Services\ComplaintReadService;

class ComplaintReadController {
    
    private ComplaintReadService $service;
    
    public function __construct() {
        $this->service = new ComplaintReadService();
    }

    public function getAll(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (!in_array(Auth::getUserType(), [Roles::PETUGAS, Roles::ADMIN], true)) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : \Constants\Config::DEFAULT_PAGINATION_LIMIT;
        $limit = min(max(1, $limit), \Constants\Config::MAX_PAGINATION_LIMIT);
        
        $status = !empty($_GET['status']) ? (string)$_GET['status'] : null;
        $kecamatan = !empty($_GET['kecamatan']) ? (string)$_GET['kecamatan'] : null;
        $q = !empty($_GET['q']) ? (string)$_GET['q'] : null;

        $result = $this->service->getAll($page, $limit, $status, $kecamatan, $q);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $result);
    }


    public function getMine(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (Auth::getUserType() !== Roles::MASYARAKAT) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : \Constants\Config::DEFAULT_PAGINATION_LIMIT;
        $limit = min(max(1, $limit), \Constants\Config::MAX_PAGINATION_LIMIT);
        
        $result = $this->service->getMine((string)Auth::getUserId(), $page, $limit);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $result);
    }

    public function getOne(): void {
        if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['id' => 'ID wajib']);
        }
        $pengaduan = $this->service->getOne((int)$_GET['id']);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $pengaduan);
    }

    public function search(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (!isset($_GET['q']) || empty(trim($_GET['q']))) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['q' => AppMessages::ERR_QUERY_REQUIRED]);
        }

        $userNik = Auth::getUserType() === Roles::MASYARAKAT ? (string)Auth::getUserId() : null;
        $results = $this->service->search($_GET['q'], $userNik);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $results);
    }

    public function statsMine(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (Auth::getUserType() !== Roles::MASYARAKAT) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $stats = $this->service->getStatsMine((string)Auth::getUserId());
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $stats);
    }
}
