<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEL);
}

$input = json_decode(file_get_contents('php://input'), true);

if (
  !isset($input['nama_petugas'], $input['username'], $input['password'], $input['telp'], $input['level']) ||
  empty(trim($input['nama_petugas'])) ||
  empty(trim($input['username'])) ||
  empty($input['password']) ||
  !in_array($input['level'], ['admin', 'petugas'])
) {
  throw new \Core\ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID_SEMUA_FIELD_WAJIB_DIIS);
}

$nama_petugas = $input['nama_petugas'];
$username = $input['username'];
$password = $input['password'];
$telp = $input['telp'];
$level = $input['level'];

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$pdo = Database::connect();

try {
  $sql = "INSERT INTO petugas (nama_petugas, username, password, telp, level) VALUES (?, ?, ?, ?, ?)";
  $statement = $pdo->prepare($sql);
  $statement->execute([$nama_petugas, $username, $hashed_password, $telp, $level]);

  \Core\Response::json(['message' => 'Akun petugas baru berhasil dibuat.']);
} catch (PDOException $e) {
  if ($e->getCode() === '23000') {
    throw new \Core\ConflictException(\Core\Messages::ERR_USERNAME_SUDAH_TERDAFTAR);} else {
    throw new \Core\BaseException('Gagal membuat akun petugas: ' . $e->getMessage(), 500);}
}
