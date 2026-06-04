<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_ANDA_HARUS_LOGIN_SEBAGAI_M);
}

if (!isset($_POST['judul'], $_POST['isi']) || empty(trim($_POST['judul']))) {
  throw new \Core\ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID_JUDUL_DAN_ISI_WAJIB_DI);
}

$judul = trim($_POST['judul']);
$isi = trim($_POST['isi']);
$nik = Auth::getUserId();
$nama_pelapor = $_SESSION['nama'];
$foto_path = null;

if (isset($_FILES['foto_bukti']) && $_FILES['foto_bukti']['error'] === UPLOAD_ERR_OK) {
  $file = $_FILES['foto_bukti'];
  $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
  $file_name = uniqid('img_', true) . '.' . $file_extension;

  $upload_dir = 'uploads/';
  $upload_path = $upload_dir . $file_name;

  $public_folder_path = __DIR__ . '/../../../public/';

  if (!is_dir($public_folder_path . $upload_dir)) {
    mkdir($public_folder_path . $upload_dir, 0777, true);
  }

  if (move_uploaded_file($file['tmp_name'], $public_folder_path . $upload_path)) {
    $foto_path = '/' . $upload_path;
  }
}

$pdo = Database::connect();

try {
  $pdo->beginTransaction();

  $sql = "INSERT INTO pengaduan (judul, isi, nik_masyarakat, foto_bukti) VALUES (?, ?, ?, ?)";
  $statement = $pdo->prepare($sql);
  $statement->execute([$judul, $isi, $nik, $foto_path]);

  $id_pengaduan_baru = $pdo->lastInsertId();


  $sql_petugas = "SELECT id_petugas FROM petugas";
  $stmt_petugas = $pdo->query($sql_petugas);
  $semua_petugas = $stmt_petugas->fetchAll(PDO::FETCH_ASSOC);

  $message = "Pengaduan baru \"$judul\" telah dibuat oleh $nama_pelapor.";
  $link = "/dashboard/complaints/" . $id_pengaduan_baru;

  foreach ($semua_petugas as $petugas) {
    NotificationManager::create($pdo, $petugas['id_petugas'], 'petugas', $message, $link);
  }


  $pdo->commit();

  \Core\Response::json(['message' => 'Pengaduan berhasil dibuat.']);
} catch (PDOException $e) {
  $pdo->rollBack();
  throw new \Core\BaseException('Gagal menyimpan data: ' . $e->getMessage(), 500);}
