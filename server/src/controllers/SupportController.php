<?php
namespace Controllers;

use Core\Response;
use Services\GeminiService;

class SupportController
{
    public function chat()
    {
        if (!\Components\Auth::isLoggedIn()) {
            return Response::error(\Core\Messages::AUTH_UNAUTHORIZED, 401);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $validator = new \Rakit\Validation\Validator();
        $validation = $validator->make($data, [
            'message' => 'required|min:1|max:1000'
        ]);
        
        $validation->validate();
        
        if ($validation->fails()) {
            return Response::error(\Core\Messages::ERR_INPUT_TIDAK_VALID, 422, $validation->errors()->toArray());
        }

        try {
            $gemini = new GeminiService();
            $reply = $gemini->chat($data['message']);

            return Response::success('Berhasil mendapatkan respon', ['reply' => $reply]);
        } catch (\Exception $e) {
            return Response::error($e->getMessage(), 500);
        }
    }
}
