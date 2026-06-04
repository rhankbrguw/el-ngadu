<?php

require_once __DIR__ . '/../../components/Database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['nik'], $input['nama'], $input['username'], $input['password'], $input['telp']) ||
    empty(trim($input['nik'])) ||
    empty(trim($input['nama'])) ||
    empty(trim($input['username'])) ||
    empty($input['password'])
) {
    throw new \Core\ValidationException(\Core\Messages::ERR_SEMUA_FIELD_WAJIB_DIISI);
}

$nik = $input['nik'];
$nama = $input['nama'];
$username = $input['username'];
$password = $input['password'];
$telp = $input['telp'];

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$pdo = Database::connect();

try {
    $sql = "INSERT INTO masyarakat (nik, nama, username, password, telp) VALUES (?, ?, ?, ?, ?)";
    $statement = $pdo->prepare($sql);
    $statement->execute([$nik, $nama, $username, $hashed_password, $telp]);

    \Core\Response::json(['message' => 'Registrasi berhasil.']);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        throw new \Core\ConflictException(\Core\Messages::ERR_NIK_ATAU_USERNAME_SUDAH_TERDAFTAR);} else {
        throw new \Core\BaseException('Gagal melakukan registrasi: ' . $e->getMessage(), 500);}
}
