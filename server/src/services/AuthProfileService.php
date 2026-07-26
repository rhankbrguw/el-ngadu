<?php

namespace Services;

use Repositories\AuthRepository;
use Core\NotFoundException;
use Core\ValidationException;
use Core\ConflictException;

class AuthProfileService {
    
    private AuthRepository $repository;
    
    public function __construct() {
        $this->repository = new AuthRepository();
    }
    
    public function getProfile(string $userId, string $userType): array {
        if (!in_array($userType, ['masyarakat', 'petugas'], true)) {
            throw new \Exception("Tipe user tidak valid.");
        }

        $user = $this->repository->getProfile($userId, $userType);

        if (!$user) {
            throw new NotFoundException(\Constants\AppMessages::ERR_ACCOUNT_NOT_FOUND);
        }
        
        return $user;
    }

    public function updateProfile(string $userId, string $userType, array $input): array {
        $table = $userType === 'masyarakat' ? 'masyarakat' : 'petugas';
        $id_col = $userType === 'masyarakat' ? 'nik' : 'id_petugas';
        $old_data = $this->repository->getProfileForUpdate($table, $id_col, $userId);
        if (!$old_data) throw new NotFoundException("Data pengguna tidak ditemukan.");
        
        $updateData = $this->buildUpdateFields($userType, $input, $old_data);
        if (empty($updateData['fields'])) throw new ValidationException("Tidak ada data yang dikirim.");
        
        $this->repository->updateProfile($table, $id_col, $userId, $updateData['fields'], $updateData['params']);
        return $updateData['session_updates'];
    }

    private function buildUpdateFields(string $userType, array $input, array $old_data): array {
        $fields = []; $params = []; $session_updates = [];
        
        if ($userType === 'masyarakat' && isset($input['nama']) && trim($input['nama']) !== $old_data['nama']) {
            $fields[] = 'nama = ?'; $params[] = $session_updates['nama'] = trim($input['nama']);
        } elseif ($userType === 'petugas' && isset($input['nama_petugas']) && trim($input['nama_petugas']) !== $old_data['nama_petugas']) {
            $fields[] = 'nama_petugas = ?'; $params[] = $session_updates['nama_petugas'] = trim($input['nama_petugas']);
        }
        
        foreach (['username', 'telp', 'email'] as $f) {
            if (isset($input[$f]) && trim($input[$f]) !== $old_data[$f]) {
                $fields[] = "{$f} = ?"; $params[] = trim($input[$f]);
                if ($f !== 'telp') $session_updates[$f] = trim($input[$f]);
            }
        }
        
        if (empty($fields)) throw new ValidationException("Tidak ada perubahan.");
        return ['fields' => $fields, 'params' => $params, 'session_updates' => $session_updates];
    }
}
