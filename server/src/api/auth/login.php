<?php
use Core\Response;
use Core\Messages;
use Core\ValidationException;
use Core\BaseException;

require_once __DIR__ . '/../../components/Database.php';
require_once __DIR__ . '/../../components/Auth.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['username']) || empty($input['password'])) {
    throw new ValidationException(Messages::AUTH_MISSING_CREDENTIALS);
}

$username = $input['username'];
$password = $input['password'];
$pdo = Database::connect();

try {
    $sql = "SELECT nik, nama, username, password, telp FROM masyarakat WHERE username = ?";
    $statement = $pdo->prepare($sql);
    $statement->execute([$username]);
    $user = $statement->fetch();

    if ($user && password_verify($password, $user['password'])) {
        Auth::login($user, 'masyarakat');

        Response::success(Messages::AUTH_LOGIN_SUCCESS, [
            'user' => [
                'nik' => $user['nik'],
                'nama' => $user['nama'],
                'username' => $user['username'],
                'telp' => $user['telp']
            ]
        ]);
    } else {
        throw new ValidationException(Messages::AUTH_USER_NOT_FOUND);
    }
} catch (PDOException $e) {
    throw new BaseException(Messages::ERROR_SERVER, 500);
}
