<?php

namespace Services;

use Repositories\ComplaintRepository;
use Core\NotFoundException;

class ComplaintReadService {
    private ComplaintRepository $repository;
    
    public function __construct() {
        $this->repository = new ComplaintRepository();
    }
    
    public function getAll(int $page, int $limit): array {
        $offset = ($page - 1) * $limit;
        
        $total = $this->repository->getCount();
        
        $data = $this->repository->getAll($limit, $offset);
        
        return [
            'pagination' => ['current_page' => $page, 'total_pages' => ceil($total / $limit), 'total_records' => $total, 'limit' => $limit],
            'data' => $data
        ];
    }

    public function getMine(string $nik, int $page, int $limit): array {
        $offset = ($page - 1) * $limit;
        
        $total = $this->repository->getCountMine($nik);
        
        $data = $this->repository->getMine($nik, $limit, $offset);
        
        return [
            'data' => $data,
            'pagination' => ['current_page' => $page, 'total_pages' => ceil($total / $limit), 'total_records' => $total, 'limit' => $limit]
        ];
    }

    public function getOne(int $id): array {
        $res = $this->repository->getOne($id);
        
        if (!$res) {
            throw new NotFoundException(\Constants\AppMessages::ERR_NOT_FOUND);
        }
        
        $data = $res;
        $data['tanggapan'] = null;
        if ($res['id_tanggapan']) {
            $data['tanggapan'] = [
                'id_tanggapan' => $res['id_tanggapan'],
                'tgl_tanggapan' => $res['tgl_tanggapan'],
                'isi_tanggapan' => $res['isi_tanggapan'],
                'nama_penanggap' => $res['nama_penanggap']
            ];
        }
        unset($data['id_tanggapan'], $data['tgl_tanggapan'], $data['isi_tanggapan'], $data['nama_penanggap']);
        
        return $data;
    }

    public function search(string $q, ?string $userNik): array {
        return $this->repository->search($q, $userNik);
    }

    public function getStatsMine(string $nik): array {
        $stats = $this->repository->getStatsMine($nik);
        
        foreach ($stats as $k => $v) $stats[$k] = (int)$v;
        return $stats;
    }
}
