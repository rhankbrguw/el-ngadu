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
      $db_driver = \Constants\Config::getDbDriver();
      
      if ($db_driver === 'sqlite') {
          $db_path = __DIR__ . '/../../el_ngadu.sqlite';
          $dsn = "sqlite:" . $db_path;
          self::$username = null;
          self::$password = null;
      } else {
          self::$host = \Constants\Config::getDbHost();
          self::$db_name = \Constants\Config::getDbName();
          self::$username = \Constants\Config::getDbUser();
          self::$password = \Constants\Config::getDbPass();
          
          if (!self::$host || !self::$db_name || !self::$username) {
              throw new \RuntimeException("Missing required database environment variables.");
          }
          
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


}