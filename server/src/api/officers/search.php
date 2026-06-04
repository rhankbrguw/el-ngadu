<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

if (!isset($_GET['q'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_QUERY_PENCARIAN_Q_DIBUTUHKAN);
}

$query = '%' . $_GET['q'] . '%';
$pdo = Database::connect();

try {
  $sql = "SELECT id_petugas, nama_petugas, username, telp, level FROM petugas WHERE nama_petugas LIKE ? OR username LIKE ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$query, $query]);
  $results = $statement->fetchAll();

  http_response_code(200);
  echo json_encode($results);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal melakukan pencarian: ' . $e->getMessage(), 500);}
