<?php

namespace Core;

use Rakit\Validation\Validator;
use Components\Database;
use Rakit\Validation\Rule;

class UniqueGlobalRule extends Rule
{
    protected $message = ":attribute sudah digunakan.";
    protected $fillableParams = ['excludeTable', 'excludeId'];

    public function check($value): bool
    {
        $column = $this->getAttribute()->getKey();
        $excludeTable = $this->parameter('excludeTable');
        $excludeId = $this->parameter('excludeId');

        $pdo = Database::connect();
        $tables = ['masyarakat' => 'nik', 'petugas' => 'id_petugas'];
        
        foreach ($tables as $table => $idCol) {
            $sql = "SELECT 1 FROM {$table} WHERE {$column} = ?";
            $params = [$value];
            
            if ($excludeId !== null && $excludeTable === $table) {
                $sql .= " AND {$idCol} != ?";
                $params[] = $excludeId;
            }
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            if ($stmt->fetch()) {
                return false;
            }
        }
        
        return true;
    }
}

class TrustedEmailRule extends Rule
{
    protected $message = "Gunakan provider email resmi (gmail, yahoo, outlook, hotmail, icloud).";

    public function check($value): bool
    {
        if (!is_string($value) || empty(trim($value))) return true;
        return (bool)preg_match('/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|yahoo\.co\.id|outlook\.com|hotmail\.com|icloud\.com|live\.com)$/i', trim($value));
    }
}

class ValidNameRule extends Rule
{
    protected $message = "Nama hanya boleh mengandung huruf, spasi, tanda petik, dan tanda hubung.";

    public function check($value): bool
    {
        if (!is_string($value) || empty(trim($value))) return true;
        return (bool)preg_match('/^[a-zA-Z\s\'-]{3,100}$/', trim($value));
    }
}

class ValidPhoneRule extends Rule
{
    protected $message = "Nomor telepon harus berupa angka yang valid (10-15 digit).";

    public function check($value): bool
    {
        if (!is_string($value) || empty(trim($value))) return true;
        return (bool)preg_match('/^(08|628|\+628|62)\d{8,14}$/', trim($value));
    }
}

class ValidNikRule extends Rule
{
    protected $message = "NIK harus berupa 16 digit angka.";

    public function check($value): bool
    {
        if (!is_string($value) || empty(trim($value))) return true;
        return (bool)preg_match('/^\d{16}$/', trim($value));
    }
}

class AppValidator
{
    public static function make(array $data, array $rules): \Rakit\Validation\Validation
    {
        $validator = new Validator();
        $validator->addValidator('unique_global', new UniqueGlobalRule());
        $validator->addValidator('trusted_email', new TrustedEmailRule());
        $validator->addValidator('valid_name', new ValidNameRule());
        $validator->addValidator('valid_phone', new ValidPhoneRule());
        $validator->addValidator('valid_nik', new ValidNikRule());
        return $validator->make($data, $rules);
    }
}
