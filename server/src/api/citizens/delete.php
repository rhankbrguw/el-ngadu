<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

// Ensure only admin can access
if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

if (!isset($_GET['nik']) || empty(trim($_GET['nik']))) {
  throw new \Core\ValidationException(\Core\Messages::ERR_NIK_MASYARAKAT_WAJIB_ADA_DI_URL);
}

$nik = $_GET['nik'];
$pdo = Database::connect();

try {
  $sql = "DELETE FROM masyarakat WHERE nik = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$nik]);

  if ($statement->rowCount() > 0) {
    \Core\Response::json(['message' => 'Akun masyarakat berhasil dihapus.']);
  } else {
    throw new \Core\NotFoundException(\Core\Messages::ERR_AKUN_MASYARAKAT_TIDAK_DITEMUKAN);}
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal menghapus data: ' . $e->getMessage(), 500);}
