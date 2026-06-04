<?php

$dir = __DIR__ . '/api';
$messagesFile = __DIR__ . '/core/Messages.php';
$messagesContent = file_get_contents($messagesFile);

$newConstants = [];

function generateConstantName($string) {
    $name = preg_replace('/[^a-zA-Z0-9]+/', '_', strtoupper(trim($string)));
    // Trim trailing/leading underscores
    $name = trim($name, '_');
    // Ensure it's not too long
    if (strlen($name) > 40) {
        $name = substr($name, 0, 40);
        $name = trim($name, '_');
    }
    return 'ERR_' . $name;
}

function processDirectory($dir) {
    global $newConstants;
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
    global $newConstants;
    $content = file_get_contents($file);
    $originalContent = $content;

    // Match Exception('...')
    $pattern = "/new \\\\Core\\\\([a-zA-Z]+Exception)\('([^']+)'\)/";
    
    $content = preg_replace_callback($pattern, function($matches) use (&$newConstants) {
        $exceptionClass = $matches[1];
        $string = $matches[2];
        
        $constName = generateConstantName($string);
        // Avoid duplicates in newConstants
        $newConstants[$constName] = $string;
        
        return "new \\Core\\$exceptionClass(\\Core\\Messages::$constName)";
    }, $content);

    // Save if changed
    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "Extracted strings from $file\n";
    }
}

processDirectory($dir);

// Append new constants to Messages.php
if (!empty($newConstants)) {
    // Find the closing brace of the class
    $pos = strrpos($messagesContent, '}');
    if ($pos !== false) {
        $insertion = "\n
        foreach ($newConstants as $name => $val) {

            if (strpos($messagesContent, "const $name") === false) {
                $insertion .= "    const $name = '$val';\n";
            }
        }
        
        $newMessagesContent = substr($messagesContent, 0, $pos) . $insertion . "}\n";
        file_put_contents($messagesFile, $newMessagesContent);
        echo "Updated Messages.php with " . count($newConstants) . " new constants.\n";
    }
}
