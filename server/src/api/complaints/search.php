<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_PENCARI);
}

if (!isset($_GET['q']) || empty(trim($_GET['q']))) {
  throw new \Core\ValidationException(\Core\Messages::ERR_QUERY_PENCARIAN_Q_DIBUTUHKAN);
}

$searchQuery = '%' . $_GET['q'] . '%';
$pdo = Database::connect();

try {
  $baseSql = "
        SELECT
            p.id, p.judul, p.status, p.created_at, m.nama AS nama_pelapor
        FROM pengaduan p
        JOIN masyarakat m ON p.nik_masyarakat = m.nik
    ";

  $conditions = [];
  $params = [];

  $userType = Auth::getUserType();

  if ($userType === 'masyarakat') {
    $userNik = $_SESSION['nik'] ?? null;
    if (!$userNik) {
      throw new Exception("Sesi tidak valid: NIK pengguna tidak ditemukan.");
    }
    $conditions[] = "p.nik_masyarakat = ?";
    $params[] = $userNik;
  }

  $conditions[] = "p.judul LIKE ?";
  $params[] = $searchQuery;

  if (count($conditions) > 0) {
    $baseSql .= " WHERE " . implode(' AND ', $conditions);
  }

  $baseSql .= " ORDER BY p.created_at DESC";

  $statement = $pdo->prepare($baseSql);
  $statement->execute($params);
  $results = $statement->fetchAll();

  http_response_code(200);
  echo json_encode($results);
} catch (PDOException | Exception $e) {
  throw new \Core\BaseException('Gagal melakukan pencarian: ' . $e->getMessage(), 500);}
