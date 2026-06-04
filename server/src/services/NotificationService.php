<?php

namespace Services;

use Components\Database;

class NotificationService {
    public function markAllAsRead(string $userId, string $userType): int {
        $pdo = Database::connect();
        $sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ? AND is_read = FALSE";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId, $userType]);
        return $stmt->rowCount();
    }

    public function markAsRead(int $notificationId, string $userId): bool {
        $pdo = Database::connect();
        $sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$notificationId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function getNotifications(string $userId, string $userType, int $page, int $limit): array {
        $pdo = Database::connect();
        $offset = ($page - 1) * $limit;

        $count_sql = "SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND user_type = ?";
        $count_stmt = $pdo->prepare($count_sql);
        $count_stmt->execute([$userId, $userType]);
        $total_records = (int)$count_stmt->fetch(\PDO::FETCH_ASSOC)['total'];
        $total_pages = ceil($total_records / $limit);

        $unread_sql = "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND user_type = ? AND is_read = 0";
        $unread_stmt = $pdo->prepare($unread_sql);
        $unread_stmt->execute([$userId, $userType]);
        $unread_count = (int)$unread_stmt->fetch(\PDO::FETCH_ASSOC)['unread'];

        $sql = "SELECT * FROM notifications WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(1, $userId, \PDO::PARAM_STR);
        $stmt->bindValue(2, $userType, \PDO::PARAM_STR);
        $stmt->bindValue(3, $limit, \PDO::PARAM_INT);
        $stmt->bindValue(4, $offset, \PDO::PARAM_INT);
        $stmt->execute();
        $notifications = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return [
            'data' => $notifications,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => (int)$total_pages,
                'total_records' => (int)$total_records,
                'unread_count' => (int)$unread_count,
                'limit' => $limit
            ]
        ];
    }
}
