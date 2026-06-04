<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/NotificationManager.php';
require_once __DIR__ . '/../../components/EmailService.php';

Auth::startSession();

if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
    throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id_pengaduan'], $input['isi_tanggapan']) || empty(trim($input['isi_tanggapan']))) {
    throw new \Core\ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID);
}

$id_pengaduan = $input['id_pengaduan'];
$isi_tanggapan = $input['isi_tanggapan'];
$id_petugas = Auth::getUserId();
$pdo = Database::connect();

try {
    $pdo->beginTransaction();

    $sql_insert = "INSERT INTO tanggapan (id_pengaduan, id_petugas, isi_tanggapan) VALUES (?, ?, ?)";
    $stmt_insert = $pdo->prepare($sql_insert);
    $stmt_insert->execute([$id_pengaduan, $id_petugas, $isi_tanggapan]);

    $sql_update = "UPDATE pengaduan SET status = 'selesai' WHERE id = ?";
    $stmt_update = $pdo->prepare($sql_update);
    $stmt_update->execute([$id_pengaduan]);

    $stmt_get_nik = $pdo->prepare("SELECT p.nik_masyarakat, p.judul, m.nama, m.email FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.id = ?");
    $stmt_get_nik->execute([$id_pengaduan]);
    $pengaduan = $stmt_get_nik->fetch(PDO::FETCH_ASSOC);

    if ($pengaduan) {
        $nik_masyarakat = $pengaduan['nik_masyarakat'];
        $message = "Petugas telah menanggapi laporan Anda #" . $id_pengaduan . ".";
        $link = "/dashboard/history/" . $id_pengaduan;
        NotificationManager::create($pdo, $nik_masyarakat, 'masyarakat', $message, $link);

        if (!empty($pengaduan['email'])) {
            $emailService = new \Components\EmailService();
            $emailTitle = "Tanggapan Baru dari Petugas";
            $emailContent = "<p>Halo <strong>" . htmlspecialchars($pengaduan['nama']) . "</strong>,</p>";
            $emailContent .= "<p>Laporan pengaduan Anda dengan judul <strong>\"" . htmlspecialchars($pengaduan['judul']) . "\"</strong> baru saja mendapat tanggapan dari petugas.</p>";
            $emailContent .= "<p>Tanggapan: <br><i>\"" . nl2br(htmlspecialchars($isi_tanggapan)) . "\"</i></p>";
            $emailContent .= "<p>Terima kasih telah menggunakan layanan El-Ngadu.</p>";
            $actionUrl = "https://el-ngadu.vercel.app/dashboard/history/" . $id_pengaduan;
            $emailService->sendEmail($pengaduan['email'], "Tanggapan Laporan Anda", $emailTitle, $emailContent, "Lihat Tanggapan", $actionUrl);
        }
    }

    $pdo->commit();

    \Core\Response::json(['message' => 'Tanggapan berhasil dikirim.']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw new \Core\BaseException('Gagal menyimpan tanggapan: ' . $e->getMessage(), 500);}
