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
      $dsn = self::buildDsn();
      try {
        self::$pdo = new PDO($dsn, self::$username, self::$password, self::getPdoOptions());
        self::configurePragmas();
      } catch (PDOException $e) {
        throw new \Core\InternalException(\Constants\AppMessages::ERR_DB_CONNECTION);
      }
    }

    return self::$pdo;
  }

  private static function configurePragmas(): void
  {
    if (\Constants\Config::getDbDriver() === 'sqlite' && self::$pdo !== null) {
      self::$pdo->exec("PRAGMA journal_mode = WAL;");
      self::$pdo->exec("PRAGMA synchronous = NORMAL;");
      self::$pdo->exec("PRAGMA cache_size = -64000;");
      self::$pdo->exec("PRAGMA temp_store = MEMORY;");
      self::$pdo->exec("PRAGMA foreign_keys = ON;");
    }
  }


  private static function buildDsn(): string
  {
    if (\Constants\Config::getDbDriver() === 'sqlite') {
      self::$username = null;
      self::$password = null;
      return "sqlite:" . __DIR__ . '/../../el_ngadu.sqlite';
    }

    self::$host = \Constants\Config::getDbHost();
    self::$db_name = \Constants\Config::getDbName();
    self::$username = \Constants\Config::getDbUser();
    self::$password = \Constants\Config::getDbPass();

    if (!self::$host || !self::$db_name || !self::$username) {
      throw new \RuntimeException("Missing required database environment variables.");
    }

    return "mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=utf8mb4";
  }

  private static function getPdoOptions(): array
  {
    return [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
  }
}