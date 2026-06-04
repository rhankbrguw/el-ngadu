<?php

namespace Services;

use Components\Database;
use Core\NotFoundException;

class ComplaintReadService {
    
    public function getAll(int $page, int $limit): array {
        $pdo = Database::connect();
        $offset = ($page - 1) * $limit;
        
        $total = $pdo->query("SELECT COUNT(*) FROM pengaduan")->fetchColumn();
        
        $sql = "SELECT p.id, p.judul, p.status, p.created_at, m.nama AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik
                ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();
        
        return [
            'pagination' => ['current_page' => $page, 'total_pages' => ceil($total / $limit), 'total_records' => $total, 'limit' => $limit],
            'data' => $stmt->fetchAll(\PDO::FETCH_ASSOC)
        ];
    }

    public function getMine(string $nik, int $page, int $limit): array {
        $pdo = Database::connect();
        $offset = ($page - 1) * $limit;
        
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM pengaduan WHERE nik_masyarakat = ?");
        $stmt->execute([$nik]);
        $total = $stmt->fetchColumn();
        
        $sql = "SELECT * FROM pengaduan WHERE nik_masyarakat = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(1, $nik, \PDO::PARAM_STR);
        $stmt->bindValue(2, $limit, \PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, \PDO::PARAM_INT);
        $stmt->execute();
        
        return [
            'data' => $stmt->fetchAll(\PDO::FETCH_ASSOC),
            'pagination' => ['current_page' => $page, 'total_pages' => ceil($total / $limit), 'total_records' => $total, 'limit' => $limit]
        ];
    }

    public function getOne(int $id): array {
        $pdo = Database::connect();
        $sql = "SELECT p.*, m.nama AS nama_pelapor, t.id_tanggapan, t.tgl_tanggapan, t.isi_tanggapan, pt.nama_petugas AS nama_penanggap
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik
                LEFT JOIN tanggapan t ON p.id = t.id_pengaduan
                LEFT JOIN petugas pt ON t.id_petugas = pt.id_petugas
                WHERE p.id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $res = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$res) throw new NotFoundException(\Core\Messages::ERR_PENGADUAN_TIDAK_DITEMUKAN ?? "Tidak ditemukan");
        
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
        $pdo = Database::connect();
        $sql = "SELECT p.id, p.judul, p.status, p.created_at, m.nama AS nama_pelapor
                FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.judul LIKE ?";
        $params = ["%$q%"];
        
        if ($userNik) {
            $sql .= " AND p.nik_masyarakat = ?";
            $params[] = $userNik;
        }
        $sql .= " ORDER BY p.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getStatsMine(string $nik): array {
        $pdo = Database::connect();
        $sql = "SELECT
            COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
            COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai,
            COUNT(*) AS total
            FROM pengaduan WHERE nik_masyarakat = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nik]);
        $stats = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        foreach ($stats as $k => $v) $stats[$k] = (int)$v;
        return $stats;
    }
}
