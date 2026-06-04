<?php

require_once __DIR__ . '/../../components/Database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['token']) || empty(trim($input['token'])) || !isset($input['password']) || empty($input['password'])) {
  throw new \Core\ValidationException("Token dan kata sandi baru wajib diisi.");
}

$token = trim($input['token']);
$password = $input['password'];
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$pdo = Database::connect();

try {
    $table = null;
    $id_column = null;
    $id_value = null;

    // Check masyarakat
    $sql = "SELECT nik, reset_expires_at, password FROM masyarakat WHERE reset_token = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if ($user) {
        $table = 'masyarakat';
        $id_column = 'nik';
        $id_value = $user['nik'];
        if (strtotime($user['reset_expires_at']) < time()) {
            throw new \Core\ValidationException("Tautan reset password sudah kedaluwarsa.");
        }
        if (password_verify($password, $user['password'])) {
            throw new \Core\ValidationException("Password baru tidak boleh sama dengan password sebelumnya.");
        }
    } else {
        // Check petugas
        $sql = "SELECT id_petugas, reset_expires_at, password FROM petugas WHERE reset_token = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$token]);
        $petugas = $stmt->fetch();

        if ($petugas) {
            $table = 'petugas';
            $id_column = 'id_petugas';
            $id_value = $petugas['id_petugas'];
            if (strtotime($petugas['reset_expires_at']) < time()) {
                throw new \Core\ValidationException("Tautan reset password sudah kedaluwarsa.");
            }
            if (password_verify($password, $petugas['password'])) {
                throw new \Core\ValidationException("Password baru tidak boleh sama dengan password sebelumnya.");
            }
        } else {
            throw new \Core\ValidationException("Tautan reset password tidak valid.");
        }
    }

    $sql = "UPDATE {$table} SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE {$id_column} = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$hashed_password, $id_value]);

    \Core\Response::json(['message' => 'Kata sandi berhasil diubah. Silakan login.']);
} catch (PDOException $e) {
    throw new \Core\BaseException('Terjadi kesalahan sistem.', 500);
}
