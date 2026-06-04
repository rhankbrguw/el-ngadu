<?php

namespace Services;

use Components\Database;
use Components\NotificationManager;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;

class ComplaintService {
    
    public function createComplaint(array $data, ?array $file, string $userId, string $userName): int {
        $foto_path = $this->handleFileUpload($file);
        $pdo = Database::connect();
        try {
            $pdo->beginTransaction();
            $sql = "INSERT INTO pengaduan (judul, isi, kategori, lokasi, nik_masyarakat, foto_bukti) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['judul'], $data['isi'], $data['kategori'], $data['lokasi'], $userId, $foto_path]);
            $id = (int)$pdo->lastInsertId();
            $this->notifyOfficers($pdo, $id, $data['judul'], $data['kategori'], $userName);
            $pdo->commit();
            return $id;
        } catch (\PDOException $e) {
            $pdo->rollBack();
            throw new BaseException("Gagal menyimpan data: " . $e->getMessage(), 500);
        }
    }

    public function updateStatus(int $id, string $status): void {
        $pdo = Database::connect();
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("SELECT p.nik_masyarakat, p.judul, m.nama, m.email FROM pengaduan p JOIN masyarakat m ON p.nik_masyarakat = m.nik WHERE p.id = ?");
            $stmt->execute([$id]);
            $comp = $stmt->fetch();
            if (!$comp) throw new \Exception("Pengaduan tidak ditemukan.", 404);

            $stmt = $pdo->prepare("UPDATE pengaduan SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);

            $msg = sprintf(AppMessages::NOTIF_COMPLAINT_STATUS_UPDATED ?? "Status pengaduan %d diubah menjadi %s", $id, $status);
            NotificationManager::create($pdo, $comp['nik_masyarakat'], 'masyarakat', $msg, "/dashboard/history/$id");
            
            if (!empty($comp['email'])) {
                $base = $_ENV['APP_URL'] ?? 'https://el-ngadu.vercel.app';
                (new EmailService())->sendEmail(
                    $comp['email'], 
                    sprintf(AppMessages::EMAIL_SUBJECT_COMPLAINT_STATUS ?? "Status: %s", strtoupper($status)), 
                    AppMessages::EMAIL_TITLE_COMPLAINT_STATUS ?? "Status Diubah", 
                    sprintf(AppMessages::EMAIL_CONTENT_COMPLAINT_STATUS ?? "Status pengaduan '%s' Anda diubah menjadi %s", htmlspecialchars($comp['nama']), htmlspecialchars($comp['judul']), strtoupper($status)), 
                    AppMessages::EMAIL_BTN_VIEW_COMPLAINT ?? "Lihat Pengaduan", 
                    rtrim($base, '/') . "/dashboard/history/$id"
                );
            }
            $pdo->commit();
        } catch (\Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }

    public function deleteComplaint(int $id): void {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("DELETE FROM pengaduan WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) throw new \Core\NotFoundException("Pengaduan tidak ditemukan");
    }
    
    private function handleFileUpload(?array $file): ?string {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) return null;
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $name = uniqid('img_', true) . '.' . $ext;
        $dir = __DIR__ . '/../../public/uploads/';
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        if (move_uploaded_file($file['tmp_name'], $dir . $name)) return '/uploads/' . $name;
        return null;
    }
    
    private function notifyOfficers(\PDO $pdo, int $id, string $title, string $cat, string $user): void {
        $officers = $pdo->query("SELECT id_petugas, email FROM petugas")->fetchAll(\PDO::FETCH_ASSOC);
        $msg = sprintf(AppMessages::NOTIF_COMPLAINT_NEW ?? "Pengaduan baru '%s' kategori %s oleh %s", $title, $cat, $user);
        $url = ($_ENV['APP_URL'] ?? 'https://el-ngadu.vercel.app') . "/dashboard/complaints/$id";
        
        $email = new EmailService();
        foreach ($officers as $off) {
            NotificationManager::create($pdo, $off['id_petugas'], 'petugas', $msg, "/dashboard/complaints/$id");
            if (!empty($off['email'])) {
                $email->sendEmail($off['email'], sprintf(AppMessages::EMAIL_SUBJECT_COMPLAINT_NEW ?? "Pengaduan Masuk: %s", $title), AppMessages::EMAIL_TITLE_COMPLAINT_NEW ?? "Pengaduan Baru", sprintf(AppMessages::EMAIL_CONTENT_COMPLAINT_NEW ?? "Judul: %s\nKategori: %s\nPelapor: %s", $title, $cat, $user), AppMessages::EMAIL_BTN_VIEW_COMPLAINT ?? "Lihat", $url);
            }
        }
    }
}
