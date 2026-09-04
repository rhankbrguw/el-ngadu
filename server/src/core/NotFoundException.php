<?php
namespace Core;
class NotFoundException extends BaseException {
    protected $statusCode = 404;
    public function __construct(string $message = "") {
        parent::__construct($message ?: \Constants\AppMessages::ERR_NOT_FOUND);
    }
}
