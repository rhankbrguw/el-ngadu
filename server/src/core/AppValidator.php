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
                return false; // Not unique
            }
        }
        
        return true;
    }
}

class AppValidator
{
    public static function make(array $data, array $rules): \Rakit\Validation\Validation
    {
        $validator = new Validator();
        $validator->addValidator('unique_global', new UniqueGlobalRule());
        return $validator->make($data, $rules);
    }
}
