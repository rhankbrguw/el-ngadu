<?php

require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/Auth.php';

require_once __DIR__ . '/../../components/EmailService.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
  throw new \Core\ValidationException(\Core\Messages::ERR_USERNAME_DAN_PASSWORD_WAJIB_DIISI);
}

$username = $input['username'];
$password = $input['password'];
$pdo = Database::connect();

function handleOtp($pdo, $table, $id_column, $id_value, $email, $nama, $userType, $username) {
    if (empty($email)) {
        throw new \Core\BaseException("Email belum diatur untuk akun ini. Tidak dapat mengirim OTP.", 400);
    }
    $otp_code = sprintf("%06d", mt_rand(1, 999999));
    $expires_at = date('Y-m-d H:i:s', strtotime('+5 minutes'));

    $sql = "UPDATE {$table} SET otp_code = ?, otp_expires_at = ? WHERE {$id_column} = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$otp_code, $expires_at, $id_value]);

    $emailService = new \Components\EmailService();
    $emailTitle = "Kode OTP Login Anda";
    $emailContent = "<p>Halo <strong>" . htmlspecialchars($nama) . "</strong>,</p>";
    $emailContent .= "<p>Seseorang mencoba masuk ke akun Anda. Berikut adalah kode OTP Anda:</p>";
    $emailContent .= "<div style='text-align: center; margin: 20px 0;'><h2 style='letter-spacing: 5px; color: #0f172a; font-size: 32px; background-color: #f1f5f9; padding: 15px; border-radius: 8px; display: inline-block;'>" . $otp_code . "</h2></div>";
    $emailContent .= "<p>Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun.</p>";

    $emailService->sendEmail($email, "Kode OTP Login El-Ngadu", $emailTitle, $emailContent);

    \Core\Response::json([
        'requires_otp' => true,
        'message' => 'OTP telah dikirim ke email Anda.',
        'userType' => $userType,
        'username' => $username // Pass back to frontend so it can verify
    ]);
    exit();
}

try {
  $sql = "SELECT nik, nama, username, password, telp, email, is_verified FROM masyarakat WHERE username = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$username]);
  $user = $statement->fetch();

  if ($user && password_verify($password, $user['password'])) {
      if (!$user['is_verified']) {
          handleOtp($pdo, 'masyarakat', 'nik', $user['nik'], $user['email'], $user['nama'], 'masyarakat', $username);
      } else {
          Auth::login($user, 'masyarakat');
          \Core\Response::json(['message' => 'Login berhasil.', 'user' => $user]);
          exit();
      }
  }

  $sql = "SELECT id_petugas, nama_petugas, username, password, telp, level, email, is_verified FROM petugas WHERE username = ?";
  $statement = $pdo->prepare($sql);
  $statement->execute([$username]);
  $petugas = $statement->fetch();

  if ($petugas && password_verify($password, $petugas['password'])) {
      if (!$petugas['is_verified']) {
          handleOtp($pdo, 'petugas', 'id_petugas', $petugas['id_petugas'], $petugas['email'], $petugas['nama_petugas'], 'petugas', $username);
      } else {
          Auth::login($petugas, 'petugas');
          \Core\Response::json(['message' => 'Login berhasil.', 'user' => $petugas]);
          exit();
      }
  }

  throw new \Core\UnauthorizedException(\Core\Messages::ERR_AKUN_TIDAK_DITEMUKAN);} catch (PDOException $e) {
  throw new \Core\BaseException('Gagal melakukan login: ' . $e->getMessage(), 500);}
