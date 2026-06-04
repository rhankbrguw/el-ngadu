<?php
namespace Core;
class ConflictException extends BaseException {
    protected $statusCode = 409;
    public function __construct(string $message = "") {
        parent::__construct($message ?: "Data conflict.");
    }
}
