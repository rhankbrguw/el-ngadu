<?php
require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
  throw new \Core\UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA);
}

$user_id = Auth::getUserId();
$user_type = Auth::getUserType();
$pdo = Database::connect();

try {
  $sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ? AND is_read = FALSE";

  $statement = $pdo->prepare($sql);
  $statement->execute([$user_id, $user_type]);

  $rowCount = $statement->rowCount();

  http_response_code(200);
  if ($rowCount > 0) {
    echo json_encode([
      'success' => true,
      'message' => $rowCount . ' notifikasi telah berhasil ditandai dibaca.'
    ]);
  } else {
    echo json_encode([
      'success' => true,
      'message' => 'Tidak ada notifikasi baru untuk ditandai.'
    ]);
  }
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal memperbarui notifikasi: ' . $e->getMessage(), 500);}
