<?php

namespace Services;

use Repositories\ReportRepository;

class ReportService {
    private ReportRepository $repository;
    
    public function __construct() {
        $this->repository = new ReportRepository();
    }
    
    public function generateReport(): array {
        return $this->repository->getFullReport();
    }
}
