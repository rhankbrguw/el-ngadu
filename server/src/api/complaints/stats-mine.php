<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

$nik = Auth::getUserId();
$pdo = Database::connect();

try {
  $sql = "
        SELECT
            COUNT(CASE WHEN status = 'diajukan' THEN 1 END) AS diajukan,
            COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS diproses,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai,
            COUNT(*) AS total
        FROM pengaduan
        WHERE nik_masyarakat = ?
    ";

  $statement = $pdo->prepare($sql);
  $statement->execute([$nik]);
  $stats = $statement->fetch(PDO::FETCH_ASSOC);


  foreach ($stats as $key => $value) {
    $stats[$key] = (int)$value;
  }

  http_response_code(200);
  echo json_encode($stats);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data statistik: ' . $e->getMessage(), 500);}
