<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Load Environment Variables
$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Auto-loader for our architecture
spl_autoload_register(function (string $class): void {
    $map = [
        'Core\\'         => __DIR__ . '/../src/core/',
        'Controllers\\'  => __DIR__ . '/../src/controllers/',
        'Services\\'     => __DIR__ . '/../src/services/',
        'Repositories\\' => __DIR__ . '/../src/repositories/',
        'Constants\\'    => __DIR__ . '/../src/constants/',
        'Components\\'   => __DIR__ . '/../src/components/',
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

if ($argc < 2) {
    die("Usage: php send_email.php <payload_json_file>\n");
}

$file = $argv[1];
if (!file_exists($file)) {
    die("File not found\n");
}

$json = file_get_contents($file);
$data = json_decode($json, true);
unlink($file); // Clean up the temp file immediately

if ($data) {
    $emailService = \Components\EmailService::getInstance();
    $emailService->sendEmail(
        $data['to'],
        $data['subject'],
        $data['title'],
        $data['content'],
        $data['actionText'] ?? null,
        $data['actionUrl'] ?? null
    );
}
