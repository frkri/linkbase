<?php
require_once '../middleware/auth.php';
require_once '../common/db.php';
$fileName = 'db';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $object = getFile();
    if (!$object) {
        http_response_code(500);
        echo 'Failed to get object';
        exit;
    }

    $boundary = uniqid();
    header('Content-Type: multipart/form-data; boundary=' . $boundary);
    echo "--$boundary\r\n";
    echo "Content-Disposition: form-data; name=\"db\"; filename=\"linkbase.db\"\r\n";
    echo "Content-Type: application/x-sqlite3\r\n\r\n";
    echo $object['file'] . "\r\n";
    echo "--$boundary--\r\n";
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES[$fileName])) {
        http_response_code(400);
        echo 'Bad Request: Missing storage object file';
        exit;
    }

    $status = storeFile();
    if (!$status) {
        http_response_code(500);
        echo 'Failed to store object';
        exit;
    }

    echo 'Object stored';
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

function getFile()
{
    global $db, $user;
    $stmt = $db->prepare('select file from objectStore where userId = :userId limit 1');
    $result = $stmt->execute([':userId' => $user['userId']]);
    if (!$result)
        return false;
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function storeFile()
{
    global $db, $fileName, $user;
    $file = $_FILES[$fileName];

    // Delete the previous object
    $stmt = $db->prepare('delete from objectStore where userId = :userId');
    $result = $stmt->execute([':userId' => $user['userId']]);
    if (!$result)
        return false;

    // Save the new object
    $stmt = $db->prepare('insert into objectStore (userId, file, createdAt) values (:userId, :file, :createdAt)');
    $result = $stmt->execute([
        ':userId' => $user['userId'],
        ':file' => file_get_contents($file['tmp_name']),
        ':createdAt' => time()
    ]);
    if (!$result)
        return false;

    return true;
}
