<?php
namespace Core;
class NotFoundException extends BaseException {
    protected $statusCode = 404;
    public function __construct(string $message = "") {
        parent::__construct($message ?: Messages::ERROR_NOT_FOUND);
    }
}
