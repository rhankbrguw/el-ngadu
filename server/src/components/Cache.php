<?php

namespace Components;

class Cache
{
    private static array $memoryCache = [];
    private static ?string $cacheDir = null;

    private static function getCacheDir(): string
    {
        if (self::$cacheDir === null) {
            self::$cacheDir = dirname(__DIR__, 2) . '/cache';
            if (!is_dir(self::$cacheDir)) {
                mkdir(self::$cacheDir, 0755, true);
            }
        }
        return self::$cacheDir;
    }

    public static function remember(string $key, int $ttlSeconds, callable $callback): mixed
    {
        $cached = self::get($key);
        if ($cached !== null) {
            return $cached;
        }

        $fresh = $callback();
        self::set($key, $fresh, $ttlSeconds);
        return $fresh;
    }

    public static function get(string $key): mixed
    {
        $now = time();
        if (isset(self::$memoryCache[$key])) {
            if (self::$memoryCache[$key]['expires_at'] >= $now) {
                return self::$memoryCache[$key]['data'];
            }
            unset(self::$memoryCache[$key]);
        }

        $filePath = self::getCacheFilePath($key);
        $payload = self::loadPayloadFromFile($filePath, $now);
        if ($payload === null) {
            return null;
        }

        self::$memoryCache[$key] = $payload;
        return $payload['data'];
    }

    private static function loadPayloadFromFile(string $filePath, int $now): ?array
    {
        if (!file_exists($filePath)) {
            return null;
        }

        $content = @file_get_contents($filePath);
        if (!$content) {
            return null;
        }

        $payload = @unserialize($content);
        $isValid = is_array($payload) && isset($payload['expires_at'], $payload['data']);
        if (!$isValid || $payload['expires_at'] < $now) {
            @unlink($filePath);
            return null;
        }

        return $payload;
    }


    public static function set(string $key, mixed $value, int $ttlSeconds = 300): void
    {
        $payload = [
            'expires_at' => time() + $ttlSeconds,
            'data' => $value,
        ];

        self::$memoryCache[$key] = $payload;

        $filePath = self::getCacheFilePath($key);
        @file_put_contents($filePath, serialize($payload), LOCK_EX);
    }

    public static function delete(string $key): void
    {
        unset(self::$memoryCache[$key]);
        $filePath = self::getCacheFilePath($key);
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
    }

    public static function flushPrefix(string $prefix): void
    {
        foreach (array_keys(self::$memoryCache) as $k) {
            if (str_starts_with((string)$k, $prefix)) {
                unset(self::$memoryCache[$k]);
            }
        }

        $dir = self::getCacheDir();
        $files = glob($dir . '/*');
        if (is_array($files)) {
            foreach ($files as $file) {
                @unlink($file);
            }
        }
    }

    private static function getCacheFilePath(string $key): string
    {
        return self::getCacheDir() . '/' . hash('sha256', $key) . '.cache';
    }
}
