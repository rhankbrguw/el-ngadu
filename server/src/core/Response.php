<?php
namespace Core;

class Response {
    public static function json(array $data, int $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

    public static function success(string $message, array $data = [], int $statusCode = 200) {
        $response = ['message' => $message];
        if (!empty($data)) {
            $response['data'] = $data;
        }
        self::json($response, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []) {
        $response = ['error' => $message];
        if (!empty($errors)) {
            $response['validation_errors'] = $errors;
        }
        self::json($response, $statusCode);
    }
}
