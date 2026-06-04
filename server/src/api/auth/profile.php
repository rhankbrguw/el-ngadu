<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MENGAKSES_SUMBER);
}

$user_id = Auth::getUserId();
$user_type = Auth::getUserType();

$pdo = Database::connect();
$user_data = null;

try {
  if ($user_type === 'masyarakat') {
    $sql = "SELECT nik, nama, username, telp FROM masyarakat WHERE nik = ?";
  } elseif ($user_type === 'petugas') {
    $sql = "SELECT id_petugas, nama_petugas, username, telp, level FROM petugas WHERE id_petugas = ?";
  } else {
    throw new Exception("Tipe user tidak valid dalam sesi.");
  }

  $statement = $pdo->prepare($sql);
  $statement->execute([$user_id]);
  $user_data = $statement->fetch();

  if (!$user_data) {
    throw new \Core\NotFoundException(\Core\Messages::ERR_DATA_PENGGUNA_TIDAK_DITEMUKAN);
  }

  \Core\Response::json(['user' => $user_data]);
} catch (Exception $e) {
  throw new \Core\BaseException('Terjadi kesalahan: ' . $e->getMessage(), 500);}
