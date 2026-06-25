<?php
namespace Core;

class Response {
    public static function json(array $data, int $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

    private static function getCodeFromStatus(int $statusCode): string {
        switch ($statusCode) {
            case 200:
            case 201: return 'OK';
            case 400: return 'BAD_REQUEST';
            case 401: return 'UNAUTHENTICATED';
            case 403: return 'UNAUTHORIZED';
            case 404: return 'NOT_FOUND';
            case 409: return 'CONFLICT';
            case 422: return 'VALIDATION_ERROR';
            case 500: return 'INTERNAL_ERROR';
            default: return 'ERROR';
        }
    }

    public static function success(string $message, array $data = [], int $statusCode = 200) {
        $response = [
            'success' => true,
            'code' => self::getCodeFromStatus($statusCode),
            'message' => $message,
            'data' => empty($data) ? new \stdClass() : $data,
            'meta' => [
                'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                'request_id' => uniqid()
            ]
        ];
        self::json($response, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []) {
        $response = [
            'success' => false,
            'code' => self::getCodeFromStatus($statusCode),
            'message' => $message,
            'errors' => empty($errors) ? null : $errors,
            'meta' => [
                'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                'request_id' => uniqid()
            ]
        ];
        self::json($response, $statusCode);
    }
}
