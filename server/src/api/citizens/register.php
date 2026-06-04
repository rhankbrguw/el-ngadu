<?php

require_once __DIR__ . '/../../components/Database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['nik'], $input['nama'], $input['username'], $input['password'], $input['email'], $input['telp']) ||
    empty(trim($input['nik'])) ||
    empty(trim($input['nama'])) ||
    empty(trim($input['username'])) ||
    empty(trim($input['email'])) ||
    empty($input['password'])
) {
    throw new \Core\ValidationException(\Core\Messages::ERR_SEMUA_FIELD_WAJIB_DIISI);
}

$nik = $input['nik'];
$nama = $input['nama'];
$username = $input['username'];
$password = $input['password'];
$email = $input['email'];
$telp = $input['telp'];

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$pdo = Database::connect();

try {
    // Check if any admin exists
    $adminCountStmt = $pdo->query("SELECT COUNT(*) FROM petugas WHERE level = 'admin'");
    $adminCount = $adminCountStmt->fetchColumn();

    if ($adminCount == 0) {
        // Register as the first Admin (Verified by default)
        $sql = "INSERT INTO petugas (nama_petugas, username, password, email, telp, level, is_verified) VALUES (?, ?, ?, ?, ?, 'admin', 1)";
        $statement = $pdo->prepare($sql);
        $statement->execute([$nama, $username, $hashed_password, $email, $telp]);
        
        $id_petugas = $pdo->lastInsertId();
        
        // Instant Login (Bypass OTP for Setup Wizard)
        require_once __DIR__ . '/../../components/Auth.php';
        
        $petugas = [
            'id_petugas' => $id_petugas,
            'username' => $username,
            'nama_petugas' => $nama,
            'email' => $email,
            'level' => 'admin',
            'telp' => $telp
        ];
        
        \Auth::login($petugas, 'petugas');

        \Core\Response::json([
            'bypass_otp' => true,
            'message' => 'Setup Wizard berhasil! Anda telah masuk sebagai Admin.',
            'user' => [
                'id_petugas' => $id_petugas,
                'username' => $username,
                'nama_petugas' => $nama,
                'email' => $email,
                'telp' => $telp,
                'level' => 'admin',
                'userType' => 'petugas'
            ]
        ]);
        return;
    } else {
        // Register as standard masyarakat
        $sql = "INSERT INTO masyarakat (nik, nama, username, password, email, telp) VALUES (?, ?, ?, ?, ?, ?)";
        $statement = $pdo->prepare($sql);
        $statement->execute([$nik, $nama, $username, $hashed_password, $email, $telp]);

        // Automatically Trigger OTP Process
        $otp_code = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $otp_expires = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $updateOtp = $pdo->prepare("UPDATE masyarakat SET otp_code = ?, otp_expires_at = ? WHERE username = ?");
        $updateOtp->execute([$otp_code, $otp_expires, $username]);

        // Send OTP via Email
        require_once __DIR__ . '/../../components/EmailService.php';
        $emailService = new \Components\EmailService();
        $emailTitle = "Kode Verifikasi Anda";
        $emailContent = "<p>Halo <strong>" . htmlspecialchars($nama) . "</strong>,</p>";
        $emailContent .= "<p>Gunakan kode OTP berikut untuk melanjutkan. Kode ini berlaku selama <strong>5 menit</strong>.</p>";
        $emailContent .= "<div style='text-align: center; margin: 30px 0;'>
                            <span style='background-color: #0f172a; color: #eab308; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px;'>" . $otp_code . "</span>
                          </div>";
        $emailContent .= "<p>Jika Anda tidak merasa melakukan tindakan ini, abaikan email ini.</p>";

        $emailService->sendEmail($email, "Kode OTP El-Ngadu", $emailTitle, $emailContent);

        \Core\Response::json([
            'requires_otp' => true,
            'username' => $username,
            'userType' => 'masyarakat',
            'message' => 'Registrasi berhasil. Silakan cek email Anda untuk OTP.'
        ]);
        return;
    }
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        throw new \Core\ConflictException(\Core\Messages::ERR_NIK_ATAU_USERNAME_SUDAH_TERDAFTAR);} else {
        throw new \Core\BaseException('Gagal melakukan registrasi: ' . $e->getMessage(), 500);}
}
