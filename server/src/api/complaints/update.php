<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';

Auth::startSession();

if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
    throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_PETUGAS_ATAU_ADMIN_Y);
}


if (!isset($_GET['id'])) {
    throw new \Core\ValidationException(\Core\Messages::ERR_ID_PENGADUAN_WAJIB_ADA_DI_URL);
}

$id_pengaduan = $_GET['id'];
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['status']) || empty(trim($input['status']))) {
    throw new \Core\ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID_STATUS_TIDAK_BOLEH_KOS);
}

$new_status = $input['status'];
$pdo = Database::connect();

try {
    $pdo->beginTransaction();

    // Ensure complaint exists before updating
    $stmt_check = $pdo->prepare("SELECT nik_masyarakat FROM pengaduan WHERE id = ?");
    $stmt_check->execute([$id_pengaduan]);
    $pengaduan = $stmt_check->fetch();

    if (!$pengaduan) {
        throw new Exception("Pengaduan tidak ditemukan.", 404);
    }

    $sql_update = "UPDATE pengaduan SET status = ? WHERE id = ?";
    $stmt_update = $pdo->prepare($sql_update);
    $stmt_update->execute([$new_status, $id_pengaduan]);

    $nik_masyarakat = $pengaduan['nik_masyarakat'];
    $message = "Status laporan Anda #" . $id_pengaduan . " telah diubah menjadi '" . htmlspecialchars($new_status) . "'.";
    $link = "/dashboard/history/" . $id_pengaduan;

    NotificationManager::create($pdo, $nik_masyarakat, 'masyarakat', $message, $link);

    $pdo->commit();

    \Core\Response::json(['message' => 'Status pengaduan berhasil diubah.']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    $code = $e->getCode() === 404 ? 404 : 500;
    http_response_code($code);
    echo json_encode(['error' => $e->getMessage()]);
}
