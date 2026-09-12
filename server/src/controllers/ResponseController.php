<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Core\ValidationException;
use Constants\AppMessages;
use Constants\Roles;
use Services\ResponseService;
use Rakit\Validation\Validator;

class ResponseController {
    private ResponseService $responseService;

    public function __construct() {
        $this->responseService = new ResponseService();
    }

    public function createResponse(): void {
        $this->requireStaff();

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = $this->validateResponseInput($input);

        $this->responseService->createResponse((int)$data['id_pengaduan'], trim($data['isi_tanggapan']), (int)Auth::getUserId());
        Response::success(AppMessages::SUCCESS_SEND_RESPONSE);
    }

    private function requireStaff(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (!in_array(Auth::getUserType(), [Roles::PETUGAS, Roles::ADMIN], true)) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }
    }

    private function validateResponseInput(array $input): array {
        $validator = new Validator();
        $validation = $validator->make($input, [
            'id_pengaduan' => 'required|numeric',
            'isi_tanggapan' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        if (empty(trim($data['isi_tanggapan']))) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['isi_tanggapan' => AppMessages::ERR_NO_DATA_UPDATE]);
        }
        return $data;
    }
}

