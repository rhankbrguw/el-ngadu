<?php

namespace Services;

use Repositories\ComplaintRepository;
use Components\NotificationManager;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;

class ComplaintService {
    private ComplaintRepository $repository;
    
    public function __construct() {
        $this->repository = new ComplaintRepository();
    }
    
    public function createComplaint(array $data, ?array $file, string $userId, string $userName): int {
        $fotoPath = $this->handleFileUpload($file);
        
        try {
            $this->repository->beginTransaction();
            $id = $this->repository->createComplaint($data, $userId, $fotoPath);
            $this->notifyOfficers($this->repository->getPdo(), $id, $data['judul'], $data['kategori'], $userName);
            $this->repository->commit();
            StatsService::invalidate();
            return $id;
        } catch (\Throwable $e) {
            $this->repository->rollBack();
            throw $e;
        }
    }

    public function updateStatus(int $id, string $status): void {
        try {
            $this->repository->beginTransaction();
            $complaint = $this->repository->getComplaintDetailsForUpdate($id);
            if (!$complaint) {
                throw new \Core\NotFoundException(\Constants\AppMessages::ERR_COMPLAINT_NOT_FOUND);
            }

            $this->repository->updateStatus($id, $status);
            $this->notifyCitizenOnStatusChange($complaint, $id, $status);
            $this->repository->commit();
            StatsService::invalidate();
        } catch (\Throwable $e) {

            $this->repository->rollBack();
            throw $e;
        }
    }

    private function notifyCitizenOnStatusChange(array $complaint, int $id, string $status): void {
        $msg = sprintf(AppMessages::NOTIF_COMPLAINT_STATUS_UPDATED, $id, $status);
        $linkUrl = sprintf(AppMessages::ROUTE_COMPLAINT_HISTORY, $id);
        NotificationManager::create($complaint['nik_masyarakat'], 'masyarakat', $msg, $linkUrl);

        if (!empty($complaint['email'])) {
            $appUrl = \Constants\Config::getAppUrl();
            EmailService::getInstance()->sendEmailAsync(
                $complaint['email'],
                sprintf(AppMessages::EMAIL_SUBJECT_COMPLAINT_STATUS, strtoupper($status)),
                AppMessages::EMAIL_TITLE_COMPLAINT_STATUS,
                sprintf(AppMessages::EMAIL_CONTENT_COMPLAINT_STATUS, htmlspecialchars($complaint['nama']), htmlspecialchars($complaint['judul']), strtoupper($status)),
                AppMessages::EMAIL_BTN_VIEW_COMPLAINT,
                rtrim($appUrl, '/') . sprintf(AppMessages::ROUTE_COMPLAINT_HISTORY, $id)
            );
        }
    }


    public function deleteComplaint(int $id): void {
        $rowCount = $this->repository->deleteComplaint($id);
        if ($rowCount === 0) {
            throw new \Core\NotFoundException(\Constants\AppMessages::ERR_COMPLAINT_NOT_FOUND);
        }
        StatsService::invalidate();
    }

    
    private function handleFileUpload(?array $file): ?string {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) return null;
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'pdf'];
        if (!in_array($ext, $allowed, true)) {
            throw new \Core\ValidationException(AppMessages::ERR_FILE_FORMAT);
        }
        $name = uniqid('img_', true) . '.' . $ext;
        $dir = __DIR__ . '/../../public/uploads/';
        if (!is_dir($dir)) mkdir($dir, \Constants\Config::DIR_PERMISSIONS, true);
        if (move_uploaded_file($file['tmp_name'], $dir . $name)) return '/uploads/' . $name;
        return null;
    }
    
    private function notifyOfficers(\PDO $pdo, int $id, string $title, string $category, string $userName): void {
        $officers = $this->repository->getOfficers();
        $msg = sprintf(AppMessages::NOTIF_COMPLAINT_NEW, $title, $category, $userName);
        $appUrl = \Constants\Config::getAppUrl();
        $url = rtrim($appUrl, '/') . sprintf(AppMessages::ROUTE_COMPLAINT_DETAIL, $id);
        $routeDetail = sprintf(AppMessages::ROUTE_COMPLAINT_DETAIL, $id);
        
        $emailService = EmailService::getInstance();
        foreach ($officers as $officer) {
            NotificationManager::create((string)$officer['id_petugas'], 'petugas', $msg, $routeDetail);
            if (!empty($officer['email'])) {
                $emailService->sendEmailAsync(
                    $officer['email'],
                    sprintf(AppMessages::EMAIL_SUBJECT_COMPLAINT_NEW, $title),
                    AppMessages::EMAIL_TITLE_COMPLAINT_NEW,
                    sprintf(AppMessages::EMAIL_CONTENT_COMPLAINT_NEW, htmlspecialchars($title), htmlspecialchars($category), htmlspecialchars($userName)),
                    AppMessages::EMAIL_BTN_VIEW_COMPLAINT,
                    $url
                );
            }
        }
    }
}
