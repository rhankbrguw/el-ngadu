<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEM);
}

$pdo = Database::connect();

try {
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
  $laporan = $statement->fetchAll();

  http_response_code(200);
  echo json_encode($laporan);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal membuat laporan: ' . $e->getMessage(), 500);}
