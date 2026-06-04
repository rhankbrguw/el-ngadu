<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
    throw new \Core\UnauthorizedException(\Core\Messages::AUTH_UNAUTHORIZED);
}

$user_id = Auth::getUserId();
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['notification_id'])) {
    throw new \Core\ValidationException(\Core\Messages::ERROR_VALIDATION, ["notification_id" => "Notification ID missing."]);
}

$notification_id = $input['notification_id'];

try {
    $pdo = Database::connect();

    $sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$notification_id, $user_id]);

    if ($stmt->rowCount() > 0) {
        \Core\Response::success("Notification marked as read.");
    } else {
        throw new \Core\NotFoundException("Notification not found.");
    }
} catch (PDOException $e) {
    throw new \Core\BaseException(\Core\Messages::ERROR_SERVER);
}