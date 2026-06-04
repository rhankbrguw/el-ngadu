<?php

namespace Controllers;

use Components\Auth;
use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Services\ResponseService;
use Rakit\Validation\Validator;

class ResponseController {
    private ResponseService $responseService;

    public function __construct() {
        $this->responseService = new ResponseService();
    }

    public function create(): void {
        Auth::startSession();

        if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK ?? 'Akses ditolak.');
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $validator = new Validator();
        $validation = $validator->make($input, [
            'id_pengaduan' => 'required|numeric',
            'isi_tanggapan' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID ?? 'Input tidak valid', $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        $idPengaduan = (int)$data['id_pengaduan'];
        $isiTanggapan = trim($data['isi_tanggapan']);

        if (empty($isiTanggapan)) {
            throw new ValidationException(\Core\Messages::ERR_INPUT_TIDAK_VALID ?? 'Input tidak valid', ['isi_tanggapan' => 'Isi tanggapan tidak boleh kosong']);
        }

        $idPetugas = Auth::getUserId();

        $this->responseService->createResponse($idPengaduan, $isiTanggapan, $idPetugas);

        Response::json(['message' => 'Tanggapan berhasil dikirim.']);
    }
}
