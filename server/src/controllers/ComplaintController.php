<?php

namespace Controllers;

use Core\Response;
use Core\UnauthorizedException;
use Core\ForbiddenException;
use Core\ValidationException;
use Constants\AppMessages;
use Constants\Roles;
use Components\Auth;
use Services\ComplaintService;
use Rakit\Validation\Validator;

class ComplaintController {
    
    private ComplaintService $service;
    
    public function __construct() {
        $this->service = new ComplaintService();
    }

    private function validateCreateComplaintInput(): array {
        $validator = new Validator();
        $validation = $validator->make($_POST + $_FILES, [
            'judul'            => 'required|min:5|max:100',
            'isi'              => 'required|min:10',
            'kategori'         => 'required',
            'lokasi'           => 'required',
            'kecamatan'        => 'default:null',
            'kelurahan'        => 'default:null',
            'tanggal_kejadian' => 'default:null',
            'prioritas'        => 'default:sedang|in:rendah,sedang,darurat',
            'is_anonim'        => 'default:0',
            'foto_bukti'       => 'uploaded_file|mimes:jpeg,png,jpg,pdf|max:5M'
        ]);
        $validation->validate();
        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }
        return $validation->getValidData();
    }

    public function createComplaint(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (Auth::getUserType() !== Roles::MASYARAKAT) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $data = $this->validateCreateComplaintInput();
        $file = $_FILES['foto_bukti'] ?? null;
        $this->service->createComplaint($data, $file, (string)Auth::getUserId(), (string)($_SESSION['nama'] ?? 'Unknown'));
        Response::success(AppMessages::SUCCESS_COMPLAINT_CREATED, [], 201);
    }


    public function updateComplaintStatus(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        if (!in_array(Auth::getUserType(), [Roles::PETUGAS, Roles::ADMIN], true)) {
            throw new ForbiddenException(AppMessages::ERR_FORBIDDEN);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = array_merge($input, $_GET);
        
        $validator = new Validator();
        $validation = $validator->make($data, [
            'id' => 'required',
            'status' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $validData = $validation->getValidData();
        $this->service->updateStatus((int)$validData['id'], $validData['status']);
        Response::success(AppMessages::SUCCESS_UPDATE_COMPLAINT_STATUS);
    }

    public function deleteComplaint(): void {
        Auth::startSession();
        if (!Auth::isLoggedIn()) {
            throw new UnauthorizedException(AppMessages::ERR_UNAUTHORIZED);
        }
        $validator = new Validator();
        $validation = $validator->make($_GET, [
            'id' => 'required'
        ]);
        $validation->validate();

        if ($validation->fails()) {
            throw new ValidationException(AppMessages::ERR_VALIDATION_FAILED, $validation->errors()->firstOfAll());
        }

        $validData = $validation->getValidData();
        $this->service->deleteComplaint((int)$validData['id']);
        Response::success(AppMessages::SUCCESS_COMPLAINT_DELETED);
    }
}
