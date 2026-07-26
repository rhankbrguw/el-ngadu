<?php

namespace Services;

use Repositories\StatsRepository;

class StatsService {
    private StatsRepository $repository;
    
    public function __construct() {
        $this->repository = new StatsRepository();
    }
    
    public function getAdminStats(): array {
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
    }

    public function getPublicStats(): array {
        $total = $this->repository->getCount('pengaduan');
        $proses = $this->repository->getCountByStatus('pengaduan', 'status', 'diproses');
        $selesai = $this->repository->getCountByStatus('pengaduan', 'status', 'selesai');

        return [
            'total' => $total,
            'proses' => $proses,
            'selesai' => $selesai,
        ];
    }
}
