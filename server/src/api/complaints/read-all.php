<?php
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/Auth.php';

Auth::startSession();

if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

$pdo = Database::connect();


$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

try {

  $totalQuery = $pdo->query("SELECT COUNT(*) FROM pengaduan");
  $total_records = $totalQuery->fetchColumn();
  $total_pages = ceil($total_records / $limit);


  $sql = "
        SELECT
            p.id,
            p.judul,
            p.status,
            p.created_at,
            m.nama AS nama_pelapor
        FROM
            pengaduan p
        JOIN
            masyarakat m ON p.nik_masyarakat = m.nik
        ORDER BY
            p.created_at DESC
        LIMIT :limit OFFSET :offset
    ";

  $statement = $pdo->prepare($sql);
  $statement->bindParam(':limit', $limit, PDO::PARAM_INT);
  $statement->bindParam(':offset', $offset, PDO::PARAM_INT);
  $statement->execute();

  $pengaduan = $statement->fetchAll();


  \Core\Response::json([
    'pagination' => [
      'current_page' => $page,
      'total_pages' => (int)$total_pages,
      'total_records' => (int)$total_records,
      'limit' => $limit
    ],
    'data' => $pengaduan
  ]);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data: ' . $e->getMessage(), 500);}
