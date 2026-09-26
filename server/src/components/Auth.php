<?php
namespace Components;

class Auth
{
  public static function startSession(): void
  {
    if (session_status() === PHP_SESSION_NONE) {
      $isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
      session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => $isHttps ? 'None' : 'Lax'
      ]);
      session_start();
    }
  }

  public static function login(array $user, string $user_type): void
  {
    self::startSession();
    session_regenerate_id(true);

    $_SESSION['is_logged_in'] = true;
    $_SESSION['user_type'] = $user_type;

    if ($user_type === 'masyarakat') {
      $_SESSION['user_id'] = $user['nik'];
      $_SESSION['nik'] = $user['nik'];
      $_SESSION['username'] = $user['username'];
      $_SESSION['nama'] = $user['nama'];
    } elseif ($user_type === 'petugas') {
      $_SESSION['user_id'] = $user['id_petugas'];
      $_SESSION['username'] = $user['username'];
      $_SESSION['nama_petugas'] = $user['nama_petugas'];
      $_SESSION['level'] = $user['level'];
    }
  }

  public static function logout(): void
  {
    self::startSession();
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
      $params = session_get_cookie_params();
      setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
      );
    }
    session_destroy();
  }

  public static function isLoggedIn(): bool
  {
    self::startSession();
    return isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true;
  }

  public static function getUserId(): string|int|null
  {
    self::startSession();
    return $_SESSION['user_id'] ?? null;
  }

  public static function getUserType(): ?string
  {
    self::startSession();
    return $_SESSION['user_type'] ?? null;
  }
}
