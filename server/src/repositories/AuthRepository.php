<?php

namespace Repositories;

use Components\Database;
use PDO;

class AuthRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function getPdo(): PDO {
        return $this->pdo;
    }

    public function getUserByEmail(string $email): ?array {
        $stmt = $this->pdo->prepare("SELECT nik as id, nama, 'masyarakat' as type FROM masyarakat WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            $stmt = $this->pdo->prepare("SELECT id_petugas as id, nama_petugas as nama, 'petugas' as type FROM petugas WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return $user ?: null;
    }

    public function updateResetToken(string $table, string $idCol, string $id, string $token, string $expires): void {
        $stmt = $this->pdo->prepare("UPDATE {$table} SET reset_token = ?, reset_expires_at = ? WHERE {$idCol} = ?");
        $stmt->execute([$token, $expires, $id]);
    }

    public function getUserByResetToken(string $token): ?array {
        $stmt = $this->pdo->prepare("SELECT nik as id, reset_expires_at, password, 'masyarakat' as type FROM masyarakat WHERE reset_token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            $stmt = $this->pdo->prepare("SELECT id_petugas as id, reset_expires_at, password, 'petugas' as type FROM petugas WHERE reset_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return $user ?: null;
    }

    public function updatePasswordAndClearToken(string $table, string $idCol, string $id, string $hash): void {
        $stmt = $this->pdo->prepare("UPDATE {$table} SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE {$idCol} = ?");
        $stmt->execute([$hash, $id]);
    }

    public function getPasswordById(string $table, string $idCol, string $id): ?array {
        $stmt = $this->pdo->prepare("SELECT password FROM {$table} WHERE {$idCol} = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updatePassword(string $table, string $idCol, string $id, string $hash): void {
        $stmt = $this->pdo->prepare("UPDATE {$table} SET password = ? WHERE {$idCol} = ?");
        $stmt->execute([$hash, $id]);
    }

    public function getProfile(string $userId, string $userType): ?array {
        if ($userType === 'masyarakat') {
            $sql = "SELECT nik, nama, username, telp, email FROM masyarakat WHERE nik = ?";
        } else {
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas WHERE id_petugas = ?";
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function getProfileForUpdate(string $table, string $idCol, string $userId): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE {$idCol} = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateProfile(string $table, string $idCol, string $userId, array $fields, array $params): void {
        try {
            $sql = "UPDATE {$table} SET " . implode(', ', $fields) . " WHERE {$idCol} = ?";
            $params[] = $userId;
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \Core\ConflictException(\Constants\AppMessages::ERR_USERNAME_SUDAH_TERDAFTAR ?? 'Username sudah digunakan.');
            }
            throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
        }
    }

    public function getCitizenByUsername(string $username): ?array {
        $stmt = $this->pdo->prepare("SELECT nik, nama, username, password, telp, email, is_verified FROM masyarakat WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function getOfficerByUsername(string $username): ?array {
        $stmt = $this->pdo->prepare("SELECT id_petugas, nama_petugas, username, password, telp, level, email, is_verified FROM petugas WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateOtp(string $table, string $idCol, string $idValue, string $otpCode, string $expiresAt): void {
        $stmt = $this->pdo->prepare("UPDATE {$table} SET otp_code = ?, otp_expires_at = ? WHERE {$idCol} = ?");
        $stmt->execute([$otpCode, $expiresAt, $idValue]);
    }

    public function verifyAndClearOtp(string $table, string $idCol, string $idValue): void {
        $stmt = $this->pdo->prepare("UPDATE {$table} SET otp_code = NULL, otp_expires_at = NULL, is_verified = 1 WHERE {$idCol} = ?");
        $stmt->execute([$idValue]);
    }

    public function getUserByUsername(string $table, string $username): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
