<?php

require_once __DIR__ . '/../../components/Database.php';


$pdo = Database::connect();

try {
  $totalQuery = $pdo->query("SELECT COUNT(*) FROM pengaduan");
  $total = $totalQuery->fetchColumn();

  $prosesQuery = $pdo->query("SELECT COUNT(*) FROM pengaduan WHERE status = 'diproses'");
  $proses = $prosesQuery->fetchColumn();

  $selesaiQuery = $pdo->query("SELECT COUNT(*) FROM pengaduan WHERE status = 'selesai'");
  $selesai = $selesaiQuery->fetchColumn();

  $stats = [
    'total' => (int)$total,
    'proses' => (int)$proses,
    'selesai' => (int)$selesai,
  ];

  http_response_code(200);
  echo json_encode($stats);
} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal mengambil data statistik: ' . $e->getMessage(), 500);}
