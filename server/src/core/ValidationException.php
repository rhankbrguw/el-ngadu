<?php
namespace Core;
class ValidationException extends BaseException {
    protected $statusCode = 400;
    private $validationErrors = [];
    public function __construct(string $message = "", array $errors = []) {
        parent::__construct($message ?: Messages::ERROR_VALIDATION);
        $this->validationErrors = $errors;
    }
    public function getValidationErrors(): array {
        return $this->validationErrors;
    }
}
