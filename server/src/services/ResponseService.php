<?php

namespace Services;

use Repositories\ResponseRepository;
use Repositories\ComplaintRepository;
use Components\NotificationManager;
use Components\EmailService;
use Core\BaseException;
use Constants\AppMessages;

class ResponseService {
    private ResponseRepository $repository;
    
    public function __construct() {
        $this->repository = new ResponseRepository();
    }
    
    public function createResponse(int $idPengaduan, string $isiTanggapan, string $idPetugas): void {
        try {
            $this->repository->beginTransaction();

            $this->repository->createResponse($idPengaduan, $idPetugas, $isiTanggapan);

            // Since ComplaintRepository isn't made yet, we can do this via ComplaintRepository later or via ResponseRepository
            // Better to keep it in ResponseRepository for this specific transaction or do a query
            $this->repository->updateComplaintStatus($idPengaduan, 'selesai');

            $pengaduan = $this->repository->getComplaintDetailsForResponse($idPengaduan);

            if ($pengaduan) {
                $nik_masyarakat = $pengaduan['nik_masyarakat'];
                $message = sprintf(AppMessages::NOTIF_RESPONSE_NEW, $idPengaduan);
                $link = "/dashboard/history/" . $idPengaduan;
                NotificationManager::create($nik_masyarakat, 'masyarakat', $message, $link);

                if (!empty($pengaduan['email'])) {
                    $emailTitle = AppMessages::EMAIL_TITLE_RESPONSE_NEW;
                    $emailContent = sprintf(AppMessages::EMAIL_CONTENT_RESPONSE_NEW, htmlspecialchars($pengaduan['nama']), htmlspecialchars($pengaduan['judul']), nl2br(htmlspecialchars($isiTanggapan)));
                    $appUrl = \Constants\Config::getAppUrl();
                    $actionUrl = $appUrl . $link;
                    EmailService::getInstance()->sendEmail($pengaduan['email'], AppMessages::EMAIL_SUBJECT_RESPONSE_NEW, $emailTitle, $emailContent, AppMessages::EMAIL_BTN_VIEW_RESPONSE, $actionUrl);
                }
            }

            $this->repository->commit();
        } catch (\Throwable $e) {
            $this->repository->rollBack();
            throw new BaseException(AppMessages::ERR_DB_SAVE_RESPONSE . ': ' . $e->getMessage(), 500);
        }
    }
}
