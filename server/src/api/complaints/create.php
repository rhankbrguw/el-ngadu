<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';

Auth::startSession();

if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_ANDA_HARUS_LOGIN_SEBAGAI_M);
}

if (!isset($_POST['judul'], $_POST['isi'], $_POST['kategori'], $_POST['lokasi']) || empty(trim($_POST['judul']))) {
  throw new \Core\ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID_JUDUL_DAN_ISI_WAJIB_DI);
}

$judul = trim($_POST['judul']);
$isi = trim($_POST['isi']);
$kategori = trim($_POST['kategori']);
$lokasi = trim($_POST['lokasi']);
$nik = Auth::getUserId();
$nama_pelapor = $_SESSION['nama'];
$foto_path = null;

if (isset($_FILES['foto_bukti']) && $_FILES['foto_bukti']['error'] === UPLOAD_ERR_OK) {
  $file = $_FILES['foto_bukti'];
  $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
  $allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];

  if (!in_array($file_extension, $allowed_extensions)) {
    throw new \Core\ValidationException('Format file tidak didukung. Hanya JPG, PNG, dan PDF.');
  }

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

  $sql = "INSERT INTO pengaduan (judul, isi, kategori, lokasi, nik_masyarakat, foto_bukti) VALUES (?, ?, ?, ?, ?, ?)";
  $statement = $pdo->prepare($sql);
  $statement->execute([$judul, $isi, $kategori, $lokasi, $nik, $foto_path]);

  $id_pengaduan_baru = $pdo->lastInsertId();

  $sql_petugas = "SELECT id_petugas FROM petugas";
  $stmt_petugas = $pdo->query($sql_petugas);
  $semua_petugas = $stmt_petugas->fetchAll(PDO::FETCH_ASSOC);

  $message = "Pengaduan baru \"$judul\" kategori $kategori telah dibuat oleh $nama_pelapor.";
  $link = "/dashboard/complaints/" . $id_pengaduan_baru;

  foreach ($semua_petugas as $petugas) {
    NotificationManager::create($pdo, $petugas['id_petugas'], 'petugas', $message, $link);
  }

  $pdo->commit();

  \Core\Response::json(['message' => 'Pengaduan berhasil dibuat.']);
} catch (PDOException $e) {
  $pdo->rollBack();
  throw new \Core\BaseException('Gagal menyimpan data: ' . $e->getMessage(), 500);
}
