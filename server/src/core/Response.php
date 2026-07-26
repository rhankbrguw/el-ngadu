<?php
namespace Core;

class Response {
    private const HTTP_OK = 200;
    private const HTTP_CREATED = 201;
    private const HTTP_BAD_REQUEST = 400;
    private const HTTP_UNAUTHORIZED = 401;
    private const HTTP_FORBIDDEN = 403;
    private const HTTP_NOT_FOUND = 404;
    private const HTTP_CONFLICT = 409;
    private const HTTP_UNPROCESSABLE = 422;
    private const HTTP_INTERNAL = 500;

    public static function json(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

    private static function getCodeFromStatus(int $statusCode): string {
        return match ($statusCode) {
            self::HTTP_OK, self::HTTP_CREATED => 'OK',
            self::HTTP_BAD_REQUEST => 'BAD_REQUEST',
            self::HTTP_UNAUTHORIZED => 'UNAUTHENTICATED',
            self::HTTP_FORBIDDEN => 'FORBIDDEN',
            self::HTTP_NOT_FOUND => 'NOT_FOUND',
            self::HTTP_CONFLICT => 'CONFLICT',
            self::HTTP_UNPROCESSABLE => 'VALIDATION_ERROR',
            self::HTTP_INTERNAL => 'INTERNAL_ERROR',
            default => 'ERROR',
        };
    }

    public static function success(string $message, array $data = [], int $statusCode = 200): void {
        $response = [
            'success' => true,
            'code' => self::getCodeFromStatus($statusCode),
            'message' => $message,
            'data' => $data,
            'meta' => [
                'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                'request_id' => uniqid()
            ]
        ];
        self::json($response, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []): void {
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
