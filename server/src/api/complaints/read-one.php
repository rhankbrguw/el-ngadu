<?php

require_once __DIR__ . '/../../components/Database.php';

if (!isset($_GET['id'])) {
    throw new \Core\ValidationException(\Core\Messages::ERR_ID_PENGADUAN_TIDAK_DISEDIAKAN);
}

$id = $_GET['id'];
$pdo = Database::connect();

try {
    $sql = "
        SELECT
            p.*,
            m.nama AS nama_pelapor,
            t.id_tanggapan,
            t.tgl_tanggapan,
            t.isi_tanggapan,
            pt.nama_petugas AS nama_penanggap
        FROM
            pengaduan p
        JOIN
            masyarakat m ON p.nik_masyarakat = m.nik
        LEFT JOIN
            tanggapan t ON p.id = t.id_pengaduan
        LEFT JOIN
            petugas pt ON t.id_petugas = pt.id_petugas
        WHERE
            p.id = ?;
    ";

    $statement = $pdo->prepare($sql);
    $statement->execute([$id]);
    $result = $statement->fetch();

    if ($result) {
        $pengaduan = [
            'id' => $result['id'],
            'judul' => $result['judul'],
            'isi' => $result['isi'],
            'status' => $result['status'],
            'foto_bukti' => $result['foto_bukti'],
            'created_at' => $result['created_at'],
            'nik_masyarakat' => $result['nik_masyarakat'],
            'nama_pelapor' => $result['nama_pelapor'],
            'tanggapan' => null
        ];

        if ($result['id_tanggapan']) {
            $pengaduan['tanggapan'] = [
                'id_tanggapan' => $result['id_tanggapan'],
                'tgl_tanggapan' => $result['tgl_tanggapan'],
                'isi_tanggapan' => $result['isi_tanggapan'],
                'nama_penanggap' => $result['nama_penanggap']
            ];
        }

        http_response_code(200);
        echo json_encode($pengaduan);
    } else {
        throw new \Core\NotFoundException(\Core\Messages::ERR_PENGADUAN_TIDAK_DITEMUKAN);}
} catch (PDOException $e) {
    throw new \Core\BaseException('Gagal mengambil data: ' . $e->getMessage(), 500);}
