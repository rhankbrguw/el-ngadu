<?php

require_once __DIR__ . '/../../components/Auth.php';
require_once __DIR__ . '/../../components/Database.php';

Auth::startSession();

if (!Auth::isLoggedIn()) {
    throw new \Core\UnauthorizedException(\Core\Messages::AUTH_UNAUTHORIZED);
}

$user_id = Auth::getUserId();
$user_type = Auth::getUserType();

try {
    $pdo = Database::connect();

    $limit = 10;
    $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
    $offset = ($page - 1) * $limit;

    $count_sql = "SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND user_type = ?";
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute([$user_id, $user_type]);
    $total_records = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
    $total_pages = ceil($total_records / $limit);

    $unread_sql = "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND user_type = ? AND is_read = 0";
    $unread_stmt = $pdo->prepare($unread_sql);
    $unread_stmt->execute([$user_id, $user_type]);
    $unread_count = $unread_stmt->fetch(PDO::FETCH_ASSOC)['unread'];

    $sql = "SELECT * FROM notifications WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(1, $user_id, PDO::PARAM_STR);
    $stmt->bindValue(2, $user_type, PDO::PARAM_STR);
    $stmt->bindValue(3, $limit, PDO::PARAM_INT);
    $stmt->bindValue(4, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    \Core\Response::json([
        'data' => $notifications,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => (int)$total_pages,
            'total_records' => (int)$total_records,
            'unread_count' => (int)$unread_count,
            'limit' => $limit
        ]
    ]);
} catch (PDOException $e) {
    throw new \Core\BaseException(\Core\Messages::ERROR_SERVER);
}
