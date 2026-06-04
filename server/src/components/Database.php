<?php
namespace Components;

use PDO;
use PDOException;

class Database
{
  private static $host = null;
  private static $db_name = null;
  private static $username = null;
  private static $password = null;
  private static $pdo = null;

  public static function connect()
  {
    if (self::$pdo === null) {
      $db_driver = $_ENV['DB_DRIVER'] ?? getenv('DB_DRIVER') ?: 'sqlite';
      
      if ($db_driver === 'sqlite') {
          $db_path = __DIR__ . '/../../el_ngadu.sqlite';
          $dsn = "sqlite:" . $db_path;
          self::$username = null;
          self::$password = null;
      } else {
          self::$host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
          self::$db_name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'el_ngadu';
          self::$username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
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
        throw new \Core\BaseException(\Core\Messages::DB_CONNECTION_FAILED, 500);
      }
    }

    return self::$pdo;
  }
}