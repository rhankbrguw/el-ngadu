<?php
// CORS Headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-loader for our new architecture
spl_autoload_register(function ($class) {
    $prefix = 'Core\\';
    $base_dir = __DIR__ . '/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // We can add logic for Controllers, Services, Repositories later
        $prefixes = [
            'Controllers\\' => '/../controllers/',
            'Services\\' => '/../services/',
            'Repositories\\' => '/../repositories/',
            'Constants\\' => '/../constants/',
            'Components\\' => '/../components/'
        ];
        
        foreach ($prefixes as $p => $dir) {
            $l = strlen($p);
            if (strncmp($p, $class, $l) === 0) {
                $relative_class = substr($class, $l);
                $file = __DIR__ . $dir . str_replace('\\', '/', $relative_class) . '.php';
                if (file_exists($file)) {
                    require $file;
                }
                return;
            }
        }
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

// Global Class Aliases for backward compatibility with procedural scripts
class_alias('Components\Auth', 'Auth');
class_alias('Components\Database', 'Database');
class_alias('Components\EmailService', 'EmailService');
class_alias('Components\NotificationManager', 'NotificationManager');

// Global Exception Handler
set_exception_handler(function (\Throwable $exception) {
    $statusCode = 500;
    $errors = [];
    $message = \Core\Messages::ERROR_SERVER;
    
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
