<?php

namespace Repositories;

use Components\Database;
use PDO;

class NotificationRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function markAllAsRead(string $userId, string $userType): int {
        $sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ? AND is_read = FALSE";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId, $userType]);
        return $stmt->rowCount();
    }

    public function markAsRead(int $notificationId, string $userId): bool {
        $sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$notificationId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function getTotalCount(string $userId, string $userType): int {
        $sql = "SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND user_type = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId, $userType]);
        return (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }

    public function getUnreadCount(string $userId, string $userType): int {
        $sql = "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND user_type = ? AND is_read = 0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId, $userType]);
        return (int)$stmt->fetch(PDO::FETCH_ASSOC)['unread'];
    }

    public function getPaginated(string $userId, string $userType, int $limit, int $offset): array {
        $sql = "SELECT * FROM notifications WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(1, $userId, PDO::PARAM_STR);
        $stmt->bindValue(2, $userType, PDO::PARAM_STR);
        $stmt->bindValue(3, $limit, PDO::PARAM_INT);
        $stmt->bindValue(4, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(string $user_identifier, string $user_type, string $title, string $message, ?string $link_url = null): bool {
        $sql = "INSERT INTO notifications (user_id, user_type, title, message, link_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$user_identifier, $user_type, $title, $message, $link_url]);
    }
}
