<?php

namespace Services;

use Components\Database;
use Components\NotificationManager;
use Components\EmailService;
use Core\BaseException;
use Core\ConflictException;
use Core\NotFoundException;
use Constants\AppMessages;
use PDO;
use PDOException;

/**
 * Service for handling Officer (Petugas/Admin) business logic
 */
class OfficerService {

    public function getAllOfficers(int $page, int $limit): array {
        $pdo = Database::connect();
        $offset = ($page - 1) * $limit;
        
        try {
            $totalQuery = $pdo->query("SELECT COUNT(*) FROM petugas");
            $total_records = $totalQuery->fetchColumn();
            $total_pages = ceil($total_records / $limit);
            
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas ORDER BY nama_petugas ASC LIMIT :limit OFFSET :offset";
            
            $statement = $pdo->prepare($sql);
            $statement->bindParam(':limit', $limit, PDO::PARAM_INT);
            $statement->bindParam(':offset', $offset, PDO::PARAM_INT);
            $statement->execute();
            
            $petugas = $statement->fetchAll(PDO::FETCH_ASSOC);
            
            return ['pagination' => ['current_page' => $page, 'total_pages' => (int)$total_pages, 'total_records' => (int)$total_records, 'limit' => $limit], 'data' => $petugas];
        } catch (PDOException $e) {
            throw new BaseException('Gagal mengambil data petugas: ' . $e->getMessage(), 500);
        }
    }

    public function createOfficer(array $data): void {
        $pdo = Database::connect();
        
        $nama_petugas = $data['nama_petugas'];
        $username = $data['username'];
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $telp = $data['telp'];
        $level = $data['level'];
        $email = $data['email'] ?? null;
        
        try {
            $pdo->beginTransaction();
            $sql = "INSERT INTO petugas (nama_petugas, username, password, telp, level, email) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nama_petugas, $username, $password, $telp, $level, $email]);
            $newId = (int)$pdo->lastInsertId();
            NotificationManager::create($pdo, $newId, 'petugas', AppMessages::NOTIF_WELCOME_OFFICER, '/dashboard');
            $pdo->commit();
            
            if (!empty($email)) {
                $content = sprintf(AppMessages::EMAIL_CONTENT_WELCOME_OFFICER, htmlspecialchars($nama_petugas), htmlspecialchars($username), ucfirst($level));
                $emailSvc = new EmailService();
                $appUrl = $_ENV['APP_URL'] ?? 'https://el-ngadu.vercel.app';
                $emailSvc->sendEmail($email, AppMessages::EMAIL_SUBJECT_WELCOME_OFFICER, AppMessages::EMAIL_TITLE_WELCOME_OFFICER, $content, AppMessages::EMAIL_BTN_LOGIN, $appUrl . '/login');
            }
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            if ($e->getCode() === '23000') throw new ConflictException('Username sudah terdaftar');
            throw new BaseException(AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function updateOfficer(int $id, array $data): void {
        $pdo = Database::connect();
        
        $fields = [];
        $params = [];
        
        $allowedFields = ['nama_petugas', 'username', 'telp', 'email', 'level'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        $params[] = $id;
        
        try {
            $pdo->beginTransaction();
            $check = $pdo->prepare("SELECT id_petugas FROM petugas WHERE id_petugas = ?");
            $check->execute([$id]);
            if (!$check->fetch()) throw new NotFoundException('Petugas tidak ditemukan');
            
            $sql = "UPDATE petugas SET " . implode(', ', $fields) . " WHERE id_petugas = ?";
            $statement = $pdo->prepare($sql);
            $statement->execute($params);
            
            $message = "Data profil Anda telah diperbarui oleh admin.";
            $link = "/dashboard/profile";
            NotificationManager::create($pdo, $id, 'petugas', $message, $link);
            
            $pdo->commit();
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            if ($e->getCode() === '23000') {
                throw new ConflictException('Username sudah digunakan');
            }
            throw new BaseException(AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function deleteOfficer(int $id): void {
        $pdo = Database::connect();
        
        try {
            $statement = $pdo->prepare("DELETE FROM petugas WHERE id_petugas = ?");
            $statement->execute([$id]);
            if ($statement->rowCount() === 0) throw new NotFoundException('Petugas tidak ditemukan');
        } catch (PDOException $e) {
            throw new BaseException('Gagal menghapus data petugas: ' . $e->getMessage(), 500);
        }
    }

    public function searchOfficers(string $query): array {
        $pdo = Database::connect();
        $searchTerm = '%' . $query . '%';
        
        try {
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas WHERE nama_petugas LIKE ? OR username LIKE ?";
            $statement = $pdo->prepare($sql);
            $statement->execute([$searchTerm, $searchTerm]);
            
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new BaseException('Gagal melakukan pencarian: ' . $e->getMessage(), 500);
        }
    }
}
