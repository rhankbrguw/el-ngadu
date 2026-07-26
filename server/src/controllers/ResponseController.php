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
        Auth::startSession();

        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (!in_array(Auth::getUserType(), [Roles::PETUGAS, Roles::ADMIN], true)) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
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
        $idPengaduan = (int)$data['id_pengaduan'];
        $isiTanggapan = trim($data['isi_tanggapan']);

        if (empty($isiTanggapan)) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, ['isi_tanggapan' => 'Isi tanggapan tidak boleh kosong']);
        }

        $idPetugas = (int)Auth::getUserId();
        $this->responseService->createResponse($idPengaduan, $isiTanggapan, $idPetugas);

        Response::success(AppMessages::SUCCESS_SEND_RESPONSE);
    }
}
