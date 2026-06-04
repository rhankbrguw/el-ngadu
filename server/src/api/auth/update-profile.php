<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA);
}

$input = json_decode(file_get_contents('php://input'), true);

$user_id = Auth::getUserId();
$user_type = Auth::getUserType();
$pdo = Database::connect();

$fields = [];
$params = [];
$session_update_data = [];

// Determine table and ID column based on user type
if ($user_type === 'masyarakat') {
  $table = 'masyarakat';
  $id_column = 'nik';
} elseif ($user_type === 'petugas') {
  $table = 'petugas';
  $id_column = 'id_petugas';
} else {
  throw new \Core\ValidationException(\Core\Messages::ERR_TIPE_PENGGUNA_TIDAK_VALID);
}

$old_sql = "SELECT * FROM {$table} WHERE {$id_column} = ?";
$old_stmt = $pdo->prepare($old_sql);
$old_stmt->execute([$user_id]);
$old_data = $old_stmt->fetch();

if (!$old_data) {
  throw new \Core\NotFoundException("Data pengguna tidak ditemukan.");
}

$has_changes = false;

if ($user_type === 'masyarakat') {
  if (isset($input['nama']) && trim($input['nama']) !== $old_data['nama']) {
    $fields[] = 'nama = ?';
    $params[] = trim($input['nama']);
    $session_update_data['nama'] = trim($input['nama']);
    $has_changes = true;
  }
} elseif ($user_type === 'petugas') {
  if (isset($input['nama_petugas']) && trim($input['nama_petugas']) !== $old_data['nama_petugas']) {
    $fields[] = 'nama_petugas = ?';
    $params[] = trim($input['nama_petugas']);
    $session_update_data['nama_petugas'] = trim($input['nama_petugas']);
    $has_changes = true;
  }
}

// Columns that can be updated by all roles
if (isset($input['username']) && trim($input['username']) !== $old_data['username']) {
  $fields[] = 'username = ?';
  $params[] = trim($input['username']);
  $session_update_data['username'] = trim($input['username']);
  $has_changes = true;
}
if (isset($input['telp']) && trim($input['telp']) !== $old_data['telp']) {
  $fields[] = 'telp = ?';
  $params[] = trim($input['telp']);
  $has_changes = true;
}
if (isset($input['email']) && trim($input['email']) !== $old_data['email']) {
  $fields[] = 'email = ?';
  $params[] = trim($input['email']);
  $session_update_data['email'] = trim($input['email']);
  $has_changes = true;
}

if (!$has_changes) {
  throw new \Core\ValidationException("Tidak ada perubahan. Data yang Anda masukkan sama dengan data saat ini.");
}

if (empty($fields)) {
  throw new \Core\ValidationException(\Core\Messages::ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB);
}

$params[] = $user_id;

try {
  $sql = "UPDATE {$table} SET " . implode(', ', $fields) . " WHERE {$id_column} = ?";
  $statement = $pdo->prepare($sql);
    $statement->execute($params);

    if (true) {
    // Update session data to immediately reflect in UI
    foreach ($session_update_data as $key => $value) {
      $_SESSION[$key] = $value;
    }

    \Core\Response::json(['message' => 'Profil berhasil diperbarui.']);
  } else {
    throw new \Core\NotFoundException(\Core\Messages::ERR_PENGGUNA_TIDAK_DITEMUKAN_ATAU_DATA_TIDAK);}
} catch (PDOException $e) {
  if ($e->getCode() === '23000') {
    throw new \Core\ConflictException(\Core\Messages::ERR_USERNAME_SUDAH_DIGUNAKAN);} else {
    throw new \Core\BaseException('Gagal memperbarui profil: ' . $e->getMessage(), 500);}
}
