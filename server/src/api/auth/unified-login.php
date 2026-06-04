<?php

require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/Auth.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_USERNAME_DAN_PASSWORD_WAJIB_DIISI);
}

$username = $input['username'];
$password = $input['password'];
$pdo = Database::connect();

try {
  $sql = "SELECT nik, nama, username, password, telp FROM masyarakat WHERE username = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$username]);
  $user = $statement->fetch();

  if ($user && password_verify($password, $user['password'])) {
    Auth::login($user, 'masyarakat');

    \Core\Response::json([
      'message' => 'Login berhasil.',
      'user' => [
        'nik' => $user['nik'],
        'nama' => $user['nama'],
        'username' => $user['username'],
        'telp' => $user['telp'],
        'userType' => 'masyarakat'
      ]
    ]);
    exit();
  }

  $sql = "SELECT id_petugas, nama_petugas, username, password, telp, level FROM petugas WHERE username = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$username]);
  $petugas = $statement->fetch();

  if ($petugas && password_verify($password, $petugas['password'])) {
    Auth::login($petugas, 'petugas');

    \Core\Response::json([
      'message' => 'Login petugas berhasil.',
      'user' => [
        'id_petugas' => $petugas['id_petugas'],
        'nama_petugas' => $petugas['nama_petugas'],
        'username' => $petugas['username'],
        'level' => $petugas['level'],
        'telp' => $petugas['telp'],
        'userType' => 'petugas'
      ]
    ]);
    exit();
  }

  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKUN_TIDAK_DITEMUKAN);} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal melakukan login: ' . $e->getMessage(), 500);}
