<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'petugas' || $_SESSION['level'] !== 'admin') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEL);
}

if (!isset($_GET['id'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_ID_PETUGAS_WAJIB_DISEDIAKAN);
}

$id = $_GET['id'];
$input = json_decode(file_get_contents('php://input'), true);
$pdo = Database::connect();

$fields = [];
$params = [];

if (isset($input['nama_petugas'])) {
  $fields[] = 'nama_petugas = ?';
  $params[] = trim($input['nama_petugas']);
}
if (isset($input['username'])) {
  $fields[] = 'username = ?';
  $params[] = trim($input['username']);
}
if (isset($input['telp'])) {
  $fields[] = 'telp = ?';
  $params[] = trim($input['telp']);
}
if (isset($input['level']) && in_array($input['level'], ['admin', 'petugas'])) {
  $fields[] = 'level = ?';
  $params[] = $input['level'];
}
if (isset($input['password']) && !empty($input['password'])) {
  if (strlen($input['password']) < 8) {
    throw new \Core\ValidationException(\Core\Messages::ERR_PASSWORD_BARU_HARUS_MINIMAL_8_KARAKTER);
  }
  $fields[] = 'password = ?';
  $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
}

if (empty($fields)) {
  throw new \Core\ValidationException(\Core\Messages::ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB);
}

$params[] = $id;

try {
  $pdo->beginTransaction();

  // Cek apakah petugas ada
  $check = $pdo->prepare("SELECT id_petugas FROM petugas WHERE id_petugas = ?");
  $check->execute([$id]);
  if (!$check->fetch()) {
      throw new \Core\NotFoundException(\Core\Messages::ERR_PETUGAS_TIDAK_DITEMUKAN_ATAU_DATA_TIDAK);
  }

  $sql = "UPDATE petugas SET " . implode(', ', $fields) . " WHERE id_petugas = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute($params);

  if (true) {

    $message = "Data profil Anda telah diperbarui oleh admin.";
    $link = "/dashboard/profile";
    NotificationManager::create($pdo, $id, 'petugas', $message, $link);

    $pdo->commit();
    \Core\Response::json(['message' => 'Data petugas berhasil diperbarui']);
  }
} catch (PDOException $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  if ($e->getCode() === '23000') {
    throw new \Core\ConflictException(\Core\Messages::ERR_USERNAME_SUDAH_DIGUNAKAN);} else {
    throw new \Core\BaseException('Gagal memperbarui data petugas: ' . $e->getMessage(), 500);}
}
