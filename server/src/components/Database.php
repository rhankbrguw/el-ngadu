<?php
namespace Components;

use PDO;
use PDOException;

class Database
{
  private static ?string $host = null;
  private static ?string $db_name = null;
  private static ?string $username = null;
  private static ?string $password = null;
  private static ?PDO $pdo = null;

  public static function connect(): PDO
  {
    if (self::$pdo === null) {
      $db_driver = $_ENV['DB_DRIVER'] ?? getenv('DB_DRIVER') ?: 'sqlite';
      
      if ($db_driver === 'sqlite') {
          $db_path = __DIR__ . '/../../el_ngadu.sqlite';
          $dsn = "sqlite:" . $db_path;
          self::$username = null;
          self::$password = null;
      } else {
          self::$host = self::requireEnv('DB_HOST');
          self::$db_name = self::requireEnv('DB_NAME');
          self::$username = self::requireEnv('DB_USER');
          self::$password = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : (getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
          $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=utf8mb4";
      }

      $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ];

      try {
        self::$pdo = new PDO($dsn, self::$username, self::$password, $options);
      } catch (PDOException $e) {
        throw new \Core\BaseException(\Constants\AppMessages::ERR_DB_CONNECTION, 500);
      }
    }

    return self::$pdo;
  }

  private static function requireEnv(string $key): string
  {
    $value = $_ENV[$key] ?? getenv($key) ?: null;
    if ($value === null || $value === '') {
      throw new \RuntimeException("Missing required environment variable: {$key}");
    }
    return $value;
  }
}