<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

$pdo = Database::connect();

$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

try {
  $totalQuery = $pdo->query("SELECT COUNT(*) FROM petugas");
  $total_records = $totalQuery->fetchColumn();
  $total_pages = ceil($total_records / $limit);

  $sql = "SELECT id_petugas, nama_petugas, username, telp, level FROM petugas ORDER BY nama_petugas ASC LIMIT :limit OFFSET :offset";

  $statement = $pdo->prepare($sql);
  $statement->bindParam(':limit', $limit, PDO::PARAM_INT);
  $statement->bindParam(':offset', $offset, PDO::PARAM_INT);
  $statement->execute();

  $petugas = $statement->fetchAll();

  \Core\Response::json([
    'pagination' => [
      'current_page' => $page,
      'total_pages' => (int)$total_pages,
      'total_records' => (int)$total_records,
      'limit' => $limit
    ],
    'data' => $petugas
  ]);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data petugas: ' . $e->getMessage(), 500);}
