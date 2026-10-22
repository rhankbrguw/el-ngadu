<?php

namespace Services;

use Repositories\NotificationRepository;

class NotificationService {
    private NotificationRepository $repository;
    
    public function __construct() {
        $this->repository = new NotificationRepository();
    }
    
    public function markAllAsRead(string $userId, string $userType): int {
        return $this->repository->markAllAsRead($userId, $userType);
    }

    public function markAsRead(int $notificationId, string $userId): bool {
        return $this->repository->markAsRead($notificationId, $userId);
    }

    public function getNotifications(string $userId, string $userType, int $page, int $limit): array {
        $offset = ($page - 1) * $limit;

        $total_records = $this->repository->getTotalCount($userId, $userType);
        $total_pages = ceil($total_records / $limit);

        $unread_count = $this->repository->getUnreadCount($userId, $userType);

        $notifications = $this->repository->getPaginated($userId, $userType, $limit, $offset);

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
