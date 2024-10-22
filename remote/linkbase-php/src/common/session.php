<?php
require_once 'db.php';

$cookieName = "linkbase-php-session";
$cookieTimeDiff = 60 * 60 * 24 * 30; // 30 days
$cookieSecure = true;
$cookieDomain = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST']);
$cookiePath = "/";

function setSession(string $userId)
{
    global $cookieName, $cookieTimeDiff, $cookieSecure, $cookieDomain, $cookiePath;
    global $db;

    // Set the cookie
    $token = bin2hex(random_bytes(16));
    setcookie($cookieName, $token, [
        'expires' => time() + $cookieTimeDiff,
        'secure' => $cookieSecure,
        'httponly' => true,
        'domain' => $cookieDomain,
        'path' => $cookiePath,
        'samesite' => 'None' // Required for cross-origin requests
    ]);

    // Insert the session into the database
    $stmt = $db->prepare("insert into session (userId, token, createdAt) values (:userId, :token, :createdAt)");
    $stmt->execute([':userId' => $userId, ':token' => $token, ':createdAt' => time()]);
    if (!$stmt)
        return false;

    return $token;
}

function getSession(string $token)
{
    global $cookieTimeDiff;
    global $db;

    $stmt = $db->prepare('select * from session where token = :token limit 1');
    $status = $stmt->execute([':token' => $token]);
    if (!$status)
        return false;

    // Fetch the session
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$result)
        return false;

    // Flush the session if it's expired
    if ($result['createdAt'] < time() - $cookieTimeDiff) {
        $stmt = $db->prepare('delete from session where token = :token');
        $stmt->execute([':token' => $token]);

        return false;
    }

    return $result;
}
