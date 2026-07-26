<?php

if (php_sapi_name() === 'cli-server') {
    $path = realpath(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if ($path && is_file($path) && strpos($path, __DIR__) === 0) {
        return false;
    }
}

require_once __DIR__ . '/../vendor/autoload.php';

// Load Environment Variables
$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$isProduction = ($_ENV['APP_ENV'] ?? getenv('APP_ENV') ?: 'production') === 'production';
ini_set('display_errors', $isProduction ? '0' : '1');
ini_set('display_startup_errors', $isProduction ? '0' : '1');
error_reporting($isProduction ? 0 : E_ALL);

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
        $router->post('/', 'Controllers\ComplaintController@createComplaint');
        $router->patch('/', 'Controllers\ComplaintController@updateComplaintStatus');
        $router->delete('/', 'Controllers\ComplaintController@deleteComplaint');
        $router->get('/mine', 'Controllers\ComplaintReadController@getMine');
        $router->get('/stats-mine', 'Controllers\ComplaintReadController@statsMine');
    });

    // Citizens Routes
    $router->mount('/citizens', function() use ($router) {
        $router->get('/', 'Controllers\CitizenController@getAll');
        $router->post('/register', 'Controllers\CitizenRegistrationController@registerCitizen');
        $router->patch('/', 'Controllers\CitizenController@updateCitizen');
        $router->delete('/', 'Controllers\CitizenController@deleteCitizen');
        $router->get('/search', 'Controllers\CitizenController@searchCitizens');
    });

    // Officers Routes
    $router->mount('/officers', function() use ($router) {
        $router->get('/', 'Controllers\OfficerController@readAll');
        $router->post('/', 'Controllers\OfficerCreateController@createOfficer');
        $router->patch('/', 'Controllers\OfficerController@updateOfficer');
        $router->delete('/', 'Controllers\OfficerController@deleteOfficer');
        $router->get('/search', 'Controllers\OfficerController@searchOfficers');
    });

    // Notifications Routes
    $router->mount('/notifications', function() use ($router) {
        $router->get('/read', 'Controllers\NotificationController@read');
        $router->post('/mark-as-read', 'Controllers\NotificationController@markAsRead');
        $router->post('/mark-all-as-read', 'Controllers\NotificationController@markAllAsRead');
    });

    // Stats Routes
    $router->mount('/stats', function() use ($router) {
        $router->get('/', 'Controllers\StatsController@getPublicStats');
        $router->get('/admin', 'Controllers\StatsController@getAdminStats');
    });

    // Responses Routes
    $router->post('/responses', 'Controllers\ResponseController@createResponse');

    // Reports Routes
    $router->get('/reports/generate', 'Controllers\ReportController@generateReport');

    // Support AI Routes
    $router->mount('/support', function() use ($router) {
        $router->post('/chat', 'Controllers\SupportController@chat');
    });
});

// Custom 404
$router->set404(function() {
    \Core\Response::error(\Constants\AppMessages::ERR_NOT_FOUND, 404);
});

// Run it!
$router->run();

