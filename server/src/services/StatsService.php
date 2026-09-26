<?php

namespace Services;

use Repositories\StatsRepository;
use Components\Cache;

class StatsService {
    private const CACHE_TTL = 60;
    private const KEY_ADMIN = 'stats:admin';
    private const KEY_PUBLIC = 'stats:public';

    private StatsRepository $repository;
    
    public function __construct() {
        $this->repository = new StatsRepository();
    }
    
    public function getAdminStats(): array {
        return Cache::remember(self::KEY_ADMIN, self::CACHE_TTL, function() {
            $pengaduanStats = $this->repository->getPengaduanStats();
            $masyarakatCount = $this->repository->getCount('masyarakat');
            $petugasCount = $this->repository->getCount('petugas');

            return [
                'pengaduan_diajukan' => (int)$pengaduanStats['diajukan'],
                'pengaduan_diproses' => (int)$pengaduanStats['diproses'],
                'pengaduan_selesai' => (int)$pengaduanStats['selesai'],
                'total_masyarakat' => $masyarakatCount,
                'total_petugas' => $petugasCount
            ];
        });
    }

    public function getPublicStats(): array {
        return Cache::remember(self::KEY_PUBLIC, self::CACHE_TTL, function() {
            $total = $this->repository->getCount('pengaduan');
            $proses = $this->repository->getCountByStatus('pengaduan', 'status', 'diproses');
            $selesai = $this->repository->getCountByStatus('pengaduan', 'status', 'selesai');

            return [
                'total' => $total,
                'proses' => $proses,
                'selesai' => $selesai,
            ];
        });
    }

    public static function invalidate(): void {
        Cache::delete(self::KEY_ADMIN);
        Cache::delete(self::KEY_PUBLIC);
    }
}

