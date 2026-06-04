<?php

namespace Services;

use Components\Database;

class ReportService {
    public function generateReport(): array {
        $pdo = Database::connect();
        
        $sql = "
            SELECT
                p.id,
                p.judul,
                p.isi,
                p.kategori,
                p.lokasi,
                p.status,
                p.created_at AS tgl_pengaduan,
                m.nik AS nik_pelapor,
                m.nama AS nama_pelapor,
                t.id_tanggapan,
                t.tgl_tanggapan,
                t.isi_tanggapan,
                pt.nama_petugas AS nama_petugas_penanggap
            FROM
                pengaduan p
            JOIN
                masyarakat m ON p.nik_masyarakat = m.nik
            LEFT JOIN
                tanggapan t ON p.id = t.id_pengaduan
            LEFT JOIN
                petugas pt ON t.id_petugas = pt.id_petugas
            ORDER BY
                p.created_at DESC
        ";

        $statement = $pdo->query($sql);
        return $statement->fetchAll(\PDO::FETCH_ASSOC);
    }
}
