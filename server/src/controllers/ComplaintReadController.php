<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Components\Auth;
use Services\ComplaintReadService;

class ComplaintReadController {
    
    private ComplaintReadService $service;
    
    public function __construct() {
        $this->service = new ComplaintReadService();
    }

    public function getAll(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK ?? 'Akses ditolak');
        }

        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $result = $this->service->getAll($page, $limit);
        Response::json($result);
    }

    public function getMine(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_ANDA_HARUS_LOGIN_SEBAGAI_M ?? 'Harus login sbg masyarakat');
        }

        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $result = $this->service->getMine(Auth::getUserId(), $page, $limit);
        Response::json($result);
    }

    public function getOne(): void {
        if (!isset($_GET['id'])) throw new ValidationException(\Core\Messages::ERR_ID_PENGADUAN_TIDAK_DISEDIAKAN ?? "ID tidak disediakan");
        $pengaduan = $this->service->getOne($_GET['id']);
        Response::json($pengaduan);
    }

    public function search(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) throw new UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_PENCARI ?? "Harus login");
        if (!isset($_GET['q']) || empty(trim($_GET['q']))) throw new ValidationException(\Core\Messages::ERR_QUERY_PENCARIAN_Q_DIBUTUHKAN ?? "Query dibutuhkan");

        $userNik = Auth::getUserType() === 'masyarakat' ? Auth::getUserId() : null;
        $results = $this->service->search($_GET['q'], $userNik);
        Response::json($results);
    }

    public function statsMine(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK ?? "Akses ditolak");
        }

        $stats = $this->service->getStatsMine(Auth::getUserId());
        Response::json($stats);
    }
}
