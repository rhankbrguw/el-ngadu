<?php
namespace Core;

class ForbiddenException extends BaseException {
    protected $statusCode = 403;

    public function __construct(string $message = 'Forbidden') {
        parent::__construct($message, $this->statusCode);
    }
}
