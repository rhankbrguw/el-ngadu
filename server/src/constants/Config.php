<?php

namespace Constants;

class Config {
    public const SMTP_CONNECT_TIMEOUT_SECONDS = 5;
    public const SMTP_TIMEOUT_SECONDS = 10;
    public const SMTP_DEFAULT_HOST = 'smtp.gmail.com';
    public const SMTP_DEFAULT_PORT = 587;
    public const SMTP_DEFAULT_FROM = 'noreply@example.com';
    public const SMTP_DEFAULT_FROM_NAME = 'Tim El-Ngadu';
    public const OTP_EXPIRY_MINUTES = 5;
    public const RESET_TOKEN_EXPIRY_MINUTES = 30;
    
    public const TOKEN_BYTE_LENGTH = 32;
    public const OTP_MIN = 1;
    public const OTP_MAX = 999999;
    public const OTP_RANGE_MIN = 0;
    public const OTP_RANGE_MAX = 999999;
    
    public const DIR_PERMISSIONS = 0777;
    public const GEMINI_TEMP = 0.3;
    public const GEMINI_MAX_TOKENS = 800;

    public const DEFAULT_PAGINATION_LIMIT = 10;
    public const MAX_PAGINATION_LIMIT = 100;

    public const ENV_DEV = 'development';
    public const ENV_PROD = 'production';

    public static function getAppUrl(): string {
        return $_ENV['APP_URL'] ?? getenv('APP_URL') ?: 'https://el-ngadu.vercel.app';
    }

    public static function getAllowedOrigins(): string {
        return $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?: 'http://localhost:5173';
    }

    public static function isDev(): bool {
        return ($_ENV['APP_ENV'] ?? getenv('APP_ENV') ?: self::ENV_PROD) === self::ENV_DEV;
    }

    public static function getDbDriver(): string {
        return $_ENV['DB_DRIVER'] ?? getenv('DB_DRIVER') ?: 'sqlite';
    }

    public static function getDbHost(): string {
        return $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '';
    }

    public static function getDbName(): string {
        return $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: '';
    }

    public static function getDbUser(): string {
        return $_ENV['DB_USER'] ?? getenv('DB_USER') ?: '';
    }

    public static function getDbPass(): string {
        $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS');
        return $pass !== false ? (string)$pass : '';
    }

    public static function getGeminiApiKey(): string {
        return $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?: '';
    }

    public static function getSmtpConfig(): array {
        return [
            'host' => $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: self::SMTP_DEFAULT_HOST,
            'port' => (int)($_ENV['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: self::SMTP_DEFAULT_PORT),
            'secure' => $_ENV['SMTP_SECURE'] ?? getenv('SMTP_SECURE') ?: '',
            'user' => $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: '',
            'pass' => $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: '',
            'from' => $_ENV['SMTP_FROM'] ?? getenv('SMTP_FROM') ?: self::SMTP_DEFAULT_FROM,
            'from_name' => $_ENV['SMTP_FROM_NAME'] ?? getenv('SMTP_FROM_NAME') ?: self::SMTP_DEFAULT_FROM_NAME,
        ];
    }
}
