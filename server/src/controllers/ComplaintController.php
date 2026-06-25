<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ValidationException;
use Constants\AppMessages;
use Components\Auth;
use Services\ComplaintService;
use Rakit\Validation\Validator;

class ComplaintController {
    
    private ComplaintService $service;
    
    public function __construct() {
        $this->service = new ComplaintService();
    }

    public function create(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || Auth::getUserType() !== 'masyarakat') {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED ?? 'Unauthorized');
        }

        $validator = new Validator();
        $validation = $validator->make($_POST + $_FILES, [
            'judul'      => 'required|min:5|max:100',
            'isi'        => 'required|min:10',
            'kategori'   => 'required',
            'lokasi'     => 'required',
            'foto_bukti' => 'uploaded_file|mimes:jpeg,png,jpg,pdf|max:5M'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED ?? 'Validation failed', $validation->errors()->firstOfAll());
        }

        $data = $validation->getValidData();
        $file = isset($_FILES['foto_bukti']) ? $_FILES['foto_bukti'] : null;
        
        $this->service->createComplaint($data, $file, Auth::getUserId(), $_SESSION['nama'] ?? 'Unknown');

        Response::json(['status' => 'success', 'message' => AppMessages::SUCCESS_COMPLAINT_CREATED ?? 'Berhasil dibuat'], 201);
    }

    public function update(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn() || !in_array(Auth::getUserType(), ['petugas', 'admin'])) {
            throw new UnauthorizedException(\Core\Messages::ERR_AKSES_DITOLAK_HANYA_PETUGAS_ATAU_ADMIN_Y ?? 'Akses ditolak');
        }

        if (!isset($_GET['id'])) throw new ValidationException(\Core\Messages::ERR_ID_PENGADUAN_WAJIB_ADA_DI_URL ?? 'ID wajib');
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty(trim($input['status'] ?? ''))) throw new ValidationException("Status tidak boleh kosong");

        $this->service->updateStatus($_GET['id'], $input['status']);
        Response::json(['message' => \Constants\AppMessages::SUCCESS_UPDATE_COMPLAINT_STATUS]);
    }

    public function delete(): void {
        if (!isset($_GET['id'])) throw new ValidationException("ID wajib");
        $this->service->deleteComplaint($_GET['id']);
        Response::json(['message' => \Constants\AppMessages::SUCCESS_COMPLAINT_DELETED]);
    }
}
