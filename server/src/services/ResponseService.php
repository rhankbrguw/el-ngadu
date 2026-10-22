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
            $this->repository->updateComplaintStatus($idPengaduan, \Constants\ComplaintStatus::COMPLETED);

            $pengaduan = $this->repository->getComplaintDetailsForResponse($idPengaduan);
            if ($pengaduan) {
                $this->notifyCitizenOnResponse($pengaduan, $idPengaduan, $isiTanggapan);
            }

            $this->repository->commit();
            StatsService::invalidate();
        } catch (\Throwable $e) {

            $this->repository->rollBack();
            throw new \Core\InternalException(AppMessages::ERR_DB_SAVE_RESPONSE . ': ' . $e->getMessage());
        }
    }

    private function notifyCitizenOnResponse(array $pengaduan, int $idPengaduan, string $isiTanggapan): void {
        $link = sprintf(AppMessages::ROUTE_COMPLAINT_HISTORY, $idPengaduan);
        NotificationManager::create($pengaduan['nik_masyarakat'], 'masyarakat', sprintf(AppMessages::NOTIF_RESPONSE_NEW, $idPengaduan), $link);

        if (!empty($pengaduan['email'])) {
            $emailContent = sprintf(AppMessages::EMAIL_CONTENT_RESPONSE_NEW, htmlspecialchars($pengaduan['nama']), htmlspecialchars($pengaduan['judul']), nl2br(htmlspecialchars($isiTanggapan)));
            $actionUrl = rtrim(\Constants\Config::getAppUrl(), '/') . $link;
            EmailService::getInstance()->sendEmailAsync($pengaduan['email'], AppMessages::EMAIL_SUBJECT_RESPONSE_NEW, AppMessages::EMAIL_TITLE_RESPONSE_NEW, $emailContent, AppMessages::EMAIL_BTN_VIEW_RESPONSE, $actionUrl);
        }
    }
}

