<?php

require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/Auth.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['otp_code']) || !isset($input['userType'])) {
  throw new \Core\ValidationException("Username, kode OTP, dan tipe pengguna wajib diisi.");
}

$username = $input['username'];
$otp_code = $input['otp_code'];
$userType = $input['userType'];
$pdo = Database::connect();

try {
    if ($userType === 'masyarakat') {
        $sql = "SELECT nik, nama, username, telp, email, otp_code, otp_expires_at FROM masyarakat WHERE username = ?";
        $statement = $pdo->prepare($sql);
        $statement->execute([$username]);
        $user = $statement->fetch();

        if (!$user) {
            throw new \Core\UnauthorizedException("Akun tidak ditemukan.");
        }

        if ($user['otp_code'] !== $otp_code || strtotime($user['otp_expires_at']) < time()) {
            throw new \Core\ValidationException("Kode OTP salah atau sudah kedaluwarsa.");
        }

        // Clear OTP and set verified
        $stmt_clear = $pdo->prepare("UPDATE masyarakat SET otp_code = NULL, otp_expires_at = NULL, is_verified = 1 WHERE nik = ?");
        $stmt_clear->execute([$user['nik']]);

        Auth::login($user, 'masyarakat');

        \Core\Response::json([
            'message' => 'Verifikasi OTP berhasil.',
            'user' => [
                'nik' => $user['nik'],
                'nama' => $user['nama'],
                'username' => $user['username'],
                'email' => $user['email'],
                'telp' => $user['telp'],
                'userType' => 'masyarakat'
            ]
        ]);
        exit();
    } elseif ($userType === 'petugas') {
        $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email, otp_code, otp_expires_at FROM petugas WHERE username = ?";
        $statement = $pdo->prepare($sql);
        $statement->execute([$username]);
        $petugas = $statement->fetch();

        if (!$petugas) {
            throw new \Core\UnauthorizedException("Akun tidak ditemukan.");
        }

        if ($petugas['otp_code'] !== $otp_code || strtotime($petugas['otp_expires_at']) < time()) {
            throw new \Core\ValidationException("Kode OTP salah atau sudah kedaluwarsa.");
        }

        // Clear OTP and set verified
        $stmt_clear = $pdo->prepare("UPDATE petugas SET otp_code = NULL, otp_expires_at = NULL, is_verified = 1 WHERE id_petugas = ?");
        $stmt_clear->execute([$petugas['id_petugas']]);

        Auth::login($petugas, 'petugas');

        \Core\Response::json([
            'message' => 'Verifikasi OTP berhasil.',
            'user' => [
                'id_petugas' => $petugas['id_petugas'],
                'nama_petugas' => $petugas['nama_petugas'],
                'username' => $petugas['username'],
                'email' => $petugas['email'],
                'level' => $petugas['level'],
                'telp' => $petugas['telp'],
                'userType' => 'petugas'
            ]
        ]);
        exit();
    } else {
        throw new \Core\ValidationException("Tipe pengguna tidak valid.");
    }
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal verifikasi OTP: ' . $e->getMessage(), 500);
}
