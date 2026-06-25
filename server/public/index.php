<?php

if (php_sapi_name() === 'cli-server') {
    $path = realpath(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if ($path && is_file($path) && strpos($path, __DIR__) === 0) {
        return false;
    }
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

// Load Environment Variables
$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

require_once __DIR__ . '/../src/core/init.php';

// Auth session start
require_once __DIR__ . '/../src/components/Auth.php';
\Components\Auth::startSession();

// Setup Router
$router = new \Bramus\Router\Router();

// CORS Handling for all routes
$router->options('/.*', function() {
    http_response_code(200);
    exit();
});

// JSON Header middleware
$router->before('GET|POST|PUT|PATCH|DELETE', '/api/.*', function() {
    header('Content-Type: application/json');
});

// Group API Routes
$router->mount('/api', function() use ($router) {
    
    // Auth Routes
    $router->mount('/auth', function() use ($router) {
        $router->post('/login', 'Controllers\AuthController@login');
        $router->post('/unified-login', 'Controllers\AuthController@unifiedLogin');
        $router->post('/verify-otp', 'Controllers\AuthController@verifyOtp');
        $router->post('/logout', 'Controllers\AuthController@logout');
        $router->post('/forgot-password', 'Controllers\AuthPasswordController@forgotPassword');
        $router->post('/reset-password', 'Controllers\AuthPasswordController@resetPassword');
        $router->get('/profile', 'Controllers\AuthProfileController@getProfile');
        $router->patch('/update-profile', 'Controllers\AuthProfileController@updateProfile');
        $router->post('/change-password', 'Controllers\AuthPasswordController@changePassword');
    });

    // Complaints Routes
    $router->mount('/complaints', function() use ($router) {
        $router->get('/', function() {
            $controller = new \Controllers\ComplaintReadController();
            if (isset($_GET['q'])) {
                $controller->search();
            } elseif (isset($_GET['id'])) {
                $controller->getOne();
            } else {
                $controller->getAll();
            }
        });
        $router->post('/', 'Controllers\ComplaintController@create');
        $router->patch('/', 'Controllers\ComplaintController@update');
        $router->delete('/', 'Controllers\ComplaintController@delete');
        $router->get('/mine', 'Controllers\ComplaintReadController@getMine');
        $router->get('/stats-mine', 'Controllers\ComplaintReadController@statsMine');
    });

    // Citizens Routes
    $router->mount('/citizens', function() use ($router) {
        $router->get('/', 'Controllers\CitizenController@getAll');
        $router->post('/register', 'Controllers\CitizenRegistrationController@register');
        $router->patch('/', 'Controllers\CitizenController@update');
        $router->delete('/', 'Controllers\CitizenController@delete');
        $router->get('/search', 'Controllers\CitizenController@search');
    });

    // Officers Routes
    $router->mount('/officers', function() use ($router) {
        $router->get('/', 'Controllers\OfficerController@readAll');
        $router->post('/', 'Controllers\OfficerCreateController@create');
        $router->patch('/', 'Controllers\OfficerController@update');
        $router->delete('/', 'Controllers\OfficerController@delete');
        $router->get('/search', 'Controllers\OfficerController@search');
    });

    // Notifications Routes
    $router->mount('/notifications', function() use ($router) {
        $router->get('/read', 'Controllers\NotificationController@read');
        $router->post('/mark-as-read', 'Controllers\NotificationController@markAsRead');
        $router->post('/mark-all-as-read', 'Controllers\NotificationController@markAllAsRead');
    });

    // Stats Routes
    $router->mount('/stats', function() use ($router) {
        $router->get('/', 'Controllers\StatsController@read');
        $router->get('/admin', 'Controllers\StatsController@admin');
    });

    // Responses Routes
    $router->post('/responses', 'Controllers\ResponseController@create');

    // Reports Routes
    $router->get('/reports/generate', 'Controllers\ReportController@generate');

    // Support AI Routes
    $router->mount('/support', function() use ($router) {
        $router->post('/chat', 'Controllers\SupportController@chat');
    });
});

// Custom 404
$router->set404(function() {
    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint tidak ditemukan'
    ]);
});

// Run it!
$router->run();
