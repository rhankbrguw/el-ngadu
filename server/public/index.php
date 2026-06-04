<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/core/init.php';

$allowed_origins = [
    'https://el-ngadu.vercel.app',
    'http://el-ngadu.test:5173'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../src/components/Auth.php';
Auth::startSession();

header('Content-Type: application/json');

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_uri) {
    case '/api/complaints':
        switch ($request_method) {
            case 'GET':
                if (isset($_GET['q'])) {
                    require __DIR__ . '/../src/api/complaints/search.php';
                } elseif (isset($_GET['id'])) {
                    require __DIR__ . '/../src/api/complaints/read-one.php';
                } else {
                    require __DIR__ . '/../src/api/complaints/read-all.php';
                }
                break;
            case 'POST':
                require __DIR__ . '/../src/api/complaints/create.php';
                break;
            case 'PATCH':
                require __DIR__ . '/../src/api/complaints/update.php';
                break;
            case 'DELETE':
                require __DIR__ . '/../src/api/complaints/delete.php';
                break;
            default:
                throw new \Core\BaseException('Metode tidak diizinkan untuk endpoint ini', 405);
        }
        break;

    case '/api/notifications/read':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/notifications/read.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan GET', 405);}
        break;

    case '/api/notifications/mark-as-read':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/notifications/mark-as-read.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/notifications/mark-all-as-read':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/notifications/mark-all-as-read.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/stats':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/stats/read.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan GET', 405);}
        break;

    case '/api/stats/admin':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/stats/admin.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/complaints/mine':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/complaints/read-mine.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan GET', 405);}
        break;

    case '/api/complaints/stats-mine':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/complaints/stats-mine.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/citizens':
        switch ($request_method) {
            case 'GET':
                require __DIR__ . '/../src/api/citizens/read-all.php';
                break;
            case 'DELETE':
                require __DIR__ . '/../src/api/citizens/delete.php';
                break;
            case 'PATCH':
                require __DIR__ . '/../src/api/citizens/update.php';
                break;
            default:
                throw new \Core\BaseException('Metode tidak diizinkan untuk endpoint ini', 405);
        }
        break;

    case '/api/citizens/register':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/citizens/register.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/auth/login':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/auth/login.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/auth/unified-login':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/auth/unified-login.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/auth/logout':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/auth/logout.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/auth/profile':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/auth/profile.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan GET', 405);}
        break;

    case '/api/auth/update-profile':
        if ($request_method === 'PATCH') {
            require __DIR__ . '/../src/api/auth/update-profile.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/auth/change-password':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/auth/change-password.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/officers/login':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/officers/login.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/officers':
        switch ($request_method) {
            case 'GET':
                require __DIR__ . '/../src/api/officers/read-all.php';
                break;
            case 'POST':
                require __DIR__ . '/../src/api/officers/create.php';
                break;
            case 'PATCH':
                require __DIR__ . '/../src/api/officers/update.php';
                break;
            case 'DELETE':
                require __DIR__ . '/../src/api/officers/delete.php';
                break;
            default:
                throw new \Core\BaseException('Metode tidak diizinkan untuk endpoint ini', 405);
        }
        break;

    case '/api/responses':
        if ($request_method === 'POST') {
            require __DIR__ . '/../src/api/responses/create.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan POST', 405);}
        break;

    case '/api/reports/generate':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/reports/generate.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan, gunakan GET', 405);}
        break;

    case '/api/officers/search':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/officers/search.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    case '/api/citizens/search':
        if ($request_method === 'GET') {
            require __DIR__ . '/../src/api/citizens/search.php';
        } else {
            throw new \Core\BaseException('Metode tidak diizinkan.', 405);}
        break;

    default:
        throw new \Core\NotFoundException('Endpoint tidak ditemukan');
}
