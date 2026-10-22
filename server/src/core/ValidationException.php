<?php
namespace Core;
class ValidationException extends BaseException {
    protected $statusCode = 422;
    private $validationErrors = [];
    public function __construct(string $message = "", array $errors = []) {
        parent::__construct($message ?: \Constants\AppMessages::ERR_VALIDATION_FAILED);
        $this->validationErrors = $errors;
    }
    public function getValidationErrors(): array {
        return $this->validationErrors;
    }
}
