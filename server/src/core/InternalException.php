<?php
namespace Core;

class InternalException extends BaseException {
    protected $statusCode = 500;

    public function __construct(string $message = "") {
        parent::__construct($message ?: \Constants\AppMessages::ERR_DB_SAVE);
    }
}
