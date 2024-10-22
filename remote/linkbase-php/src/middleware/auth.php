<?php
require_once '../common/session.php';

if (!isset($_COOKIE[$cookieName])) {
    http_response_code(401);
    exit();
}

// Get the session from the cookie
$cookie = $_COOKIE[$cookieName];
$session = getSession($cookie);
if (!$session) {
    http_response_code(401);
    exit();
}

// Get the user from the session
$stmt = $db->prepare("SELECT * FROM user WHERE userId = :userId limit 1");
$status = $stmt->execute([':userId' => $session['userId']]);
if (!$status) {
    http_response_code(500);
    exit();
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    http_response_code(401);
    exit();
}
