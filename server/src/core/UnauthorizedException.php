<?php
namespace Core;
class UnauthorizedException extends BaseException {
    protected $statusCode = 401;
    public function __construct(string $message = "") {
        parent::__construct($message ?: \Constants\AppMessages::ERR_UNAUTHORIZED);
    }
}
