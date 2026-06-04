<?php

namespace Services;

use Components\Database;
use Core\NotFoundException;
use Core\ValidationException;
use Core\ConflictException;

class AuthProfileService {
    
    public function getProfile(string $userId, string $userType): array {
        $pdo = Database::connect();
        
        if ($userType === 'masyarakat') {
            $sql = "SELECT nik, nama, username, telp, email FROM masyarakat WHERE nik = ?";
        } elseif ($userType === 'petugas') {
            $sql = "SELECT id_petugas, nama_petugas, username, telp, level, email FROM petugas WHERE id_petugas = ?";
        } else {
            throw new \Exception("Tipe user tidak valid.");
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            throw new NotFoundException(\Core\Messages::ERR_DATA_PENGGUNA_TIDAK_DITEMUKAN ?? "Data tidak ditemukan.");
        }
        
        return $user;
    }

    public function updateProfile(string $userId, string $userType, array $input): array {
        $pdo = Database::connect();
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $id_col = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE {$id_col} = ?");
        $stmt->execute([$userId]);
        $old_data = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$old_data) throw new NotFoundException("Data pengguna tidak ditemukan.");
        
        $fields = [];
        $params = [];
        $session_updates = [];
        $has_changes = false;
        
        if ($userType === 'masyarakat' && isset($input['nama']) && trim($input['nama']) !== $old_data['nama']) {
            $fields[] = 'nama = ?';
            $params[] = $session_updates['nama'] = trim($input['nama']);
            $has_changes = true;
        } elseif ($userType === 'petugas' && isset($input['nama_petugas']) && trim($input['nama_petugas']) !== $old_data['nama_petugas']) {
            $fields[] = 'nama_petugas = ?';
            $params[] = $session_updates['nama_petugas'] = trim($input['nama_petugas']);
            $has_changes = true;
        }
        
        foreach (['username', 'telp', 'email'] as $f) {
            if (isset($input[$f]) && trim($input[$f]) !== $old_data[$f]) {
                $fields[] = "{$f} = ?";
                $params[] = trim($input[$f]);
                if ($f !== 'telp') $session_updates[$f] = trim($input[$f]);
                $has_changes = true;
            }
        }
        
        if (!$has_changes) throw new ValidationException("Tidak ada perubahan.");
        if (empty($fields)) throw new ValidationException("Tidak ada data yang dikirim.");
        
        $params[] = $userId;
        
        try {
            $sql = "UPDATE {$table} SET " . implode(', ', $fields) . " WHERE {$id_col} = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $session_updates;
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') throw new ConflictException(\Core\Messages::ERR_USERNAME_SUDAH_DIGUNAKAN ?? "Username/email sudah digunakan.");
            throw new \Exception("Gagal memperbarui profil: " . $e->getMessage(), 500);
        }
    }
}
