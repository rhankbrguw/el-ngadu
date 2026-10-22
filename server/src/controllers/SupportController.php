<?php
namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Services\GeminiService;
use Constants\AppMessages;

class SupportController
{
    public function chat(): void
    {
        if (!\Components\Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new \Rakit\Validation\Validator();
        $validation = $validator->make($data, [
            'message' => 'required|min:1|max:1000'
        ]);
        
        $validation->validate();
        
        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->toArray());
        }

        $gemini = new GeminiService();
        $reply = $gemini->chat($data['message']);

        Response::success(AppMessages::SUCCESS_GET_SUPPORT_REPLY, ['reply' => $reply]);
    }
}
