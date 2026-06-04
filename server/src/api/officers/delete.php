<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEL);
}

if (!isset($_GET['id'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_ID_PETUGAS_WAJIB_DISEDIAKAN);
}

$id = $_GET['id'];


if ($id == Auth::getUserId()) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_ADMIN_TIDAK_DAPAT_MENGHAPUS_AKUNNYA_SEND);
}

$pdo = Database::connect();

try {
  $sql = "DELETE FROM petugas WHERE id_petugas = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$id]);

  if ($statement->rowCount() > 0) {
    \Core\Response::json(['message' => 'Akun petugas berhasil dihapus']);
  } else {
    throw new \Core\NotFoundException(\Core\Messages::ERR_PETUGAS_TIDAK_DITEMUKAN);}
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal menghapus data petugas: ' . $e->getMessage(), 500);}
