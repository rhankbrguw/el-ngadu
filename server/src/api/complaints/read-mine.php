<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_ANDA_HARUS_LOGIN_SEBAGAI_M);
}

$nik = Auth::getUserId();
$pdo = Database::connect();

try {
  $limit = 10;
  $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
  $offset = ($page - 1) * $limit;

  $count_sql = "SELECT COUNT(*) as total FROM pengaduan WHERE nik_masyarakat = ?";
  $count_stmt = $pdo->prepare($count_sql);
  $count_stmt->execute([$nik]);
  $total_records = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
  $total_pages = ceil($total_records / $limit);

  $sql = "SELECT * FROM pengaduan WHERE nik_masyarakat = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
  $statement = $pdo->prepare($sql);
  $statement->bindValue(1, $nik, PDO::PARAM_STR);
  $statement->bindValue(2, $limit, PDO::PARAM_INT);
  $statement->bindValue(3, $offset, PDO::PARAM_INT);
  $statement->execute();

  $my_pengaduan = $statement->fetchAll(PDO::FETCH_ASSOC);

  \Core\Response::json([
    'data' => $my_pengaduan,
    'pagination' => [
      'current_page' => $page,
      'total_pages' => (int)$total_pages,
      'total_records' => (int)$total_records,
      'limit' => $limit
    ]
  ]);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data: ' . $e->getMessage(), 500);}
