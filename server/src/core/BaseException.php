<?php
namespace Core;
use Exception;
class BaseException extends Exception {
    protected $statusCode = 500;
    public function getStatusCode(): int {
        return $this->statusCode;
    }
}
