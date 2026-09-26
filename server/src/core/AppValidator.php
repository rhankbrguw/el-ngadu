<?php

namespace Core;

use Rakit\Validation\Validator;
use Components\Database;
use Rakit\Validation\Rule;

class UniqueGlobalRule extends Rule
{
    protected $message = ":attribute sudah digunakan.";
    protected $fillableParams = ['excludeTable', 'excludeId'];
    private const TABLE_COLUMNS = [
        'masyarakat' => ['nik', 'username', 'email', 'telp'],
        'petugas'    => ['id_petugas', 'username', 'email', 'telp'],
    ];

    public function check($value): bool
    {
        $column = $this->getAttribute()->getKey();
        $excludeTable = $this->parameter('excludeTable');
        $excludeId = $this->parameter('excludeId');
        $tables = ['masyarakat' => 'nik', 'petugas' => 'id_petugas'];

        foreach ($tables as $table => $idCol) {
            if ($this->columnExists($table, $column) && $this->isDuplicate($table, $column, $value, $idCol, $excludeTable, $excludeId)) {
                return false;
            }
        }
        return true;
    }

    private function columnExists(string $table, string $column): bool
    {
        return in_array($column, self::TABLE_COLUMNS[$table] ?? [], true);
    }

    private function isDuplicate(string $table, string $col, $val, string $idCol, ?string $exTable, $exId): bool
    {
        $sql = "SELECT 1 FROM {$table} WHERE {$col} = ?";
        $params = [$val];
        if ($exId !== null && $exTable === $table) {
            $sql .= " AND {$idCol} != ?";
            $params[] = $exId;
        }
        $stmt = Database::connect()->prepare($sql);
        $stmt->execute($params);
        return (bool)$stmt->fetch();
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
