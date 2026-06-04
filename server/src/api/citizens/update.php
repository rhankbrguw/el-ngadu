<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';

Auth::startSession();

if (!Auth::isLoggedIn() || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

if (!isset($_GET['nik'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_NIK_MASYARAKAT_WAJIB_ADA_DI_URL);
}

$nik = $_GET['nik'];
$input = json_decode(file_get_contents('php://input'), true);
$pdo = Database::connect();

$fields = [];
$params = [];

if (isset($input['nama'])) {
  $fields[] = 'nama = ?';
  $params[] = trim($input['nama']);
}
if (isset($input['username'])) {
  $fields[] = 'username = ?';
  $params[] = trim($input['username']);
}
if (isset($input['telp'])) {
  $fields[] = 'telp = ?';
  $params[] = trim($input['telp']);
}

if (empty($fields)) {
  throw new \Core\ValidationException(\Core\Messages::ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB);
}

$params[] = $nik;

try {
  $pdo->beginTransaction();

  // Cek apakah masyarakat ada
  $check = $pdo->prepare("SELECT nik FROM masyarakat WHERE nik = ?");
  $check->execute([$nik]);
  if (!$check->fetch()) {
      throw new \Core\NotFoundException(\Core\Messages::ERR_MASYARAKAT_TIDAK_DITEMUKAN_ATAU_DATA_TID);
  }

  $sql = "UPDATE masyarakat SET " . implode(', ', $fields) . " WHERE nik = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute($params);

  if (true) {

    $message = "Data profil Anda telah diperbarui oleh admin.";
    $link = "/dashboard/profile";
    NotificationManager::create($pdo, $nik, 'masyarakat', $message, $link);

    $pdo->commit();
    \Core\Response::json(['message' => 'Data masyarakat berhasil diperbarui.']);
  }
} catch (PDOException $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  if ($e->getCode() === '23000') {
    throw new \Core\ConflictException(\Core\Messages::ERR_USERNAME_SUDAH_DIGUNAKAN);} else {
    throw new \Core\BaseException('Gagal memperbarui data: ' . $e->getMessage(), 500);}
}
