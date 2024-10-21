<?php
require_once '../common/session.php';

if (!isset($_COOKIE[$cookieName])) {
    http_response_code(401);
    exit();
}

$cookie = $_COOKIE[$cookieName];
$session = getSession($cookie);
if (!$session) {
    http_response_code(401);
    exit();
}
