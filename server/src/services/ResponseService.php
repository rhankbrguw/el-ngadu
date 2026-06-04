<?php

namespace Services;

use Components\Database;
use Components\NotificationManager;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;

class ResponseService {
    public function createResponse(int $idPengaduan, string $isiTanggapan, string $idPetugas): void {
        $pdo = Database::connect();

        try {
            $pdo->beginTransaction();

            $sql_insert = "INSERT INTO tanggapan (id_pengaduan, id_petugas, isi_tanggapan) VALUES (?, ?, ?)";
            $stmt_insert = $pdo->prepare($sql_insert);
            $stmt_insert->execute([$idPengaduan, $idPetugas, $isiTanggapan]);

            $sql_update = "UPDATE pengaduan SET status = 'selesai' WHERE id = ?";
            $stmt_update = $pdo->prepare($sql_update);
            $stmt_update->execute([$idPengaduan]);

            $stmt_get_nik = $pdo->prepare("SELECT p.nik_masyarakat, p.judul, m.nama, m.email FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.id = ?");
            $stmt_get_nik->execute([$idPengaduan]);
            $pengaduan = $stmt_get_nik->fetch(\PDO::FETCH_ASSOC);

            if ($pengaduan) {
                $nik_masyarakat = $pengaduan['nik_masyarakat'];
                $message = sprintf(AppMessages::NOTIF_RESPONSE_NEW, $idPengaduan);
                $link = "/dashboard/history/" . $idPengaduan;
                NotificationManager::create($pdo, $nik_masyarakat, 'masyarakat', $message, $link);

                if (!empty($pengaduan['email'])) {
                    $emailService = new EmailService();
                    $emailTitle = AppMessages::EMAIL_TITLE_RESPONSE_NEW;
                    $emailContent = sprintf(AppMessages::EMAIL_CONTENT_RESPONSE_NEW, htmlspecialchars($pengaduan['nama']), htmlspecialchars($pengaduan['judul']), nl2br(htmlspecialchars($isiTanggapan)));
                    $appUrl = $_ENV['APP_URL'] ?? 'https://el-ngadu.vercel.app';
                    $actionUrl = $appUrl . $link;
                    $emailService->sendEmail($pengaduan['email'], AppMessages::EMAIL_SUBJECT_RESPONSE_NEW, $emailTitle, $emailContent, AppMessages::EMAIL_BTN_VIEW_RESPONSE, $actionUrl);
                }
            }

            $pdo->commit();
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw new BaseException(AppMessages::ERR_DB_SAVE_RESPONSE . ': ' . $e->getMessage(), 500);
        }
    }
}
