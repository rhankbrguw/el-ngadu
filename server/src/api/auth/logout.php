<?php

require_once __DIR__ . '/../../components/Auth.php';

Auth::logout();

\Core\Response::json(['message' => 'Logout berhasil.']);
