<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Core\BaseException;
use Core\NotFoundException;
use Services\NotificationService;
use Rakit\Validation\Validator;

class NotificationController {
    private NotificationService $notificationService;

    public function __construct() {
        $this->notificationService = new NotificationService();
    }

    public function markAllAsRead(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Core\Messages::ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA ?? 'Harus login.');
        }

        $userId = Auth::getUserId();
        $userType = Auth::getUserType();

        try {
            $rowCount = $this->notificationService->markAllAsRead($userId, $userType);

            if ($rowCount > 0) {
                Response::json([
                    'success' => true,
                    'message' => $rowCount . ' notifikasi telah berhasil ditandai dibaca.'
                ]);
            } else {
                Response::json([
                    'success' => true,
                    'message' => \Constants\AppMessages::ERR_NO_NOTIF
                ]);
            }
        } catch (\PDOException $e) {
            throw new BaseException('Gagal memperbarui notifikasi: ' . $e->getMessage(), 500);
        }
    }

    public function markAsRead(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Core\Messages::AUTH_UNAUTHORIZED ?? 'Harus login.');
        }

        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $validator = new Validator();
        $validation = $validator->make($input, [
            'notification_id' => 'required|numeric'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(\Core\Messages::ERROR_VALIDATION ?? 'Validation Error', $validation->errors()->firstOfAll());
        }

        $userId = Auth::getUserId();
        $notificationId = (int)$validation->getValidData()['notification_id'];

        try {
            $success = $this->notificationService->markAsRead($notificationId, $userId);

            if ($success) {
                Response::success("Notification marked as read.");
            } else {
                throw new NotFoundException("Notification not found.");
            }
        } catch (\PDOException $e) {
            throw new BaseException(\Core\Messages::ERROR_SERVER ?? 'Server Error', 500);
        }
    }

    public function read(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Core\Messages::AUTH_UNAUTHORIZED ?? 'Harus login.');
        }

        $userId = Auth::getUserId();
        $userType = Auth::getUserType();
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = 10;

        try {
            $result = $this->notificationService->getNotifications($userId, $userType, $page, $limit);
            Response::json($result);
        } catch (\PDOException $e) {
            throw new BaseException(\Core\Messages::ERROR_SERVER ?? 'Server Error', 500);
        }
    }
}
