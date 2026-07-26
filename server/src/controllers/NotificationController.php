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
            throw new UnauthorizedException(\Constants\AppMessages::ERR_UNAUTHORIZED);
        }

        $userId = Auth::getUserId();
        $userType = Auth::getUserType();

        $rowCount = $this->notificationService->markAllAsRead($userId, $userType);

        if ($rowCount > 0) {
            Response::success(sprintf(\Constants\AppMessages::NOTIF_MARKED_READ, $rowCount));
        } else {
            Response::success(\Constants\AppMessages::ERR_NO_NOTIF);
        }
    }

    public function markAsRead(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Constants\AppMessages::ERR_UNAUTHORIZED);
        }

        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $validator = new Validator();
        $validation = $validator->make($input, [
            'notification_id' => 'required|numeric'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(\Constants\AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $userId = Auth::getUserId();
        $notificationId = (int)$validation->getValidData()['notification_id'];

        $success = $this->notificationService->markAsRead($notificationId, $userId);

        if ($success) {
            Response::success(\Constants\AppMessages::NOTIF_SINGLE_MARKED_READ);
        } else {
            throw new NotFoundException(\Constants\AppMessages::ERR_ACCOUNT_NOT_FOUND);
        }
    }

    public function read(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(\Constants\AppMessages::ERR_UNAUTHORIZED);
        }

        $userId = Auth::getUserId();
        $userType = Auth::getUserType();
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = 10;

        $result = $this->notificationService->getNotifications($userId, $userType, $page, $limit);
        Response::success(\Constants\AppMessages::SUCCESS_OPERATION, $result);
    }
}
