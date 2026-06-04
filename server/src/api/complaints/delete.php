<?php

require_once __DIR__ . '/../../components/Database.php';

if (!isset($_GET['id'])) {
    throw new \Core\ValidationException(\Core\Messages::ERR_ID_PENGADUAN_WAJIB_DISEDIAKAN);
}

$id = $_GET['id'];
$pdo = Database::connect();

try {
    $sql = "DELETE FROM pengaduan WHERE id = ?";
    $statement = $pdo->prepare($sql);
    $statement->execute([$id]);

    if ($statement->rowCount() > 0) {
        \Core\Response::json(['message' => 'Pengaduan berhasil dihapus']);
    } else {
        throw new \Core\NotFoundException(\Core\Messages::ERR_PENGADUAN_TIDAK_DITEMUKAN);}
} catch (PDOException $e) {
    throw new \Core\BaseException('Gagal menghapus data: ' . $e->getMessage(), 500);}
