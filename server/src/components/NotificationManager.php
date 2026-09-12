<?php
namespace Components;

use PDO;
use PDOException;
use Constants\AppMessages;
use Core\BaseException;

class NotificationManager
{
  /**
   * Creates a new notification.
   * @param string $user_identifier The NIK or ID of the user to notify.
   * @param string $user_type 'masyarakat' or 'petugas'.
   * @param string $message The notification message.
   * @param string|null $link_url An optional URL for the notification.
   * @return bool True on success.
   */
  public static function create(string $user_identifier, string $user_type, string $message, ?string $link_url = null): bool
  {
    $title = AppMessages::NOTIF_DEFAULT_TITLE;
    try {
      $repo = new \Repositories\NotificationRepository();
      return $repo->create($user_identifier, $user_type, $title, $message, $link_url);
    } catch (PDOException $e) {
      throw new BaseException(AppMessages::ERR_DB_SAVE . ': ' . $e->getMessage(), 500);
    }
  }
}
