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

    // We can't automatically parse complex logic easily, but we can do some regex replacements for the most common patterns.
    

    $content = preg_replace("/http_response_code\(400\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\ValidationException($1);", $content);
    

    $content = preg_replace("/http_response_code\(401\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\UnauthorizedException($1);", $content);
    

    $content = preg_replace("/http_response_code\(403\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\UnauthorizedException($1);", $content);
    

    $content = preg_replace("/http_response_code\(404\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\NotFoundException($1);", $content);
    

    $content = preg_replace("/http_response_code\(500\);\s*echo json_encode\(\['error' => (.*?)\]\);\s*(?:exit\(\);|exit;)?/", "throw new \Core\BaseException($1, 500);", $content);
    
    // 6. Success JSON (without message)
    $content = preg_replace("/http_response_code\(20\d\);\s*echo json_encode\(\[(.*?)\]\);/s", "\Core\Response::json([$1]);", $content);

    // Save if changed
    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "Updated $file\n";
    }
}

processDirectory($dir);
echo "Refactoring complete.\n";
