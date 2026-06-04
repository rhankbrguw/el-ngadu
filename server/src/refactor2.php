<?php

$dir = __DIR__ . '/api';

function processDirectory($dir) {
    $files = glob($dir . '/*');
    foreach ($files as $file) {
        if (is_dir($file)) {
            processDirectory($file);
        } else if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            processFile($file);
        }
    }
}

function processFile($file) {
    $content = file_get_contents($file);
    $originalContent = $content;


    $content = preg_replace("/http_response_code\(409\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\ConflictException($1);", $content);
    

    $content = preg_replace("/http_response_code\(405\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\BaseException($1, 405);", $content);

    // Save if changed
    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "Updated $file\n";
    }
}

processDirectory($dir);
echo "Refactoring 2 complete.\n";

// Also update index.php for 405 and 404
$index = __DIR__ . '/../public/index.php';
$content = file_get_contents($index);
$content = preg_replace("/http_response_code\(405\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:break;|exit\(\);|exit;)?/", "throw new \Core\BaseException($1, 405);", $content);
$content = preg_replace("/http_response_code\(404\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:break;|exit\(\);|exit;)?/", "throw new \Core\NotFoundException($1);", $content);
file_put_contents($index, $content);

