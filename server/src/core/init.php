<?php
// CORS Headers
$allowedOrigins = array_filter(array_map('trim', explode(',', $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?: 'http://localhost:5173')));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} elseif (!empty($allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$allowedOrigins[0]}");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-loader for our architecture
spl_autoload_register(function (string $class): void {
    $map = [
        'Core\\'         => __DIR__ . '/',
        'Controllers\\'  => __DIR__ . '/../controllers/',
        'Services\\'     => __DIR__ . '/../services/',
        'Repositories\\' => __DIR__ . '/../repositories/',
        'Constants\\'    => __DIR__ . '/../constants/',
        'Components\\'   => __DIR__ . '/../components/',
    ];

    foreach ($map as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }
        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require $file;
        }
        return;
    }
});

// Global Class Aliases for backward compatibility
class_alias('Components\Auth', 'Auth');
class_alias('Components\Database', 'Database');
class_alias('Components\EmailService', 'EmailService');
class_alias('Components\NotificationManager', 'NotificationManager');

// Global Exception Handler
set_exception_handler(function (\Throwable $exception): void {
    $statusCode = 500;
    $errors = [];
    $message = \Constants\AppMessages::ERR_DB_SAVE;
    
    if ($exception instanceof \Core\BaseException) {
        $statusCode = $exception->getStatusCode();
        $message = $exception->getMessage();
        if ($exception instanceof \Core\ValidationException) {
            $errors = $exception->getValidationErrors();
        }
    } else {
        $message = $exception->getMessage();
    }
    
    \Core\Response::error($message, $statusCode, $errors);
});
