<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_BISA_MENG);
}

$pdo = Database::connect();

try {
  // Calculate total complaints by status
  $pengaduanSql = "
        SELECT
            COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
            COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai
        FROM pengaduan
    ";
  $pengaduanStmt = $pdo->query($pengaduanSql);
  $pengaduanStats = $pengaduanStmt->fetch(PDO::FETCH_ASSOC);

  // Calculate total users
  $masyarakatCount = $pdo->query("SELECT COUNT(*) FROM masyarakat")->fetchColumn();
  $petugasCount = $pdo->query("SELECT COUNT(*) FROM petugas")->fetchColumn();

  $stats = [
    'pengaduan_diajukan' => (int)$pengaduanStats['diajukan'],
    'pengaduan_diproses' => (int)$pengaduanStats['diproses'],
    'pengaduan_selesai' => (int)$pengaduanStats['selesai'],
    'total_masyarakat' => (int)$masyarakatCount,
    'total_petugas' => (int)$petugasCount
  ];

  http_response_code(200);
  echo json_encode($stats);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data statistik admin: ' . $e->getMessage(), 500);}
