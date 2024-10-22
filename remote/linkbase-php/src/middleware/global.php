<?php
require_once '../common/env.php';

# Set default headers
header('Access-Control-Allow-Origin: ' . $env['ALLOW_ORIGIN']);
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');

// Always allow preflight requests due to CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}
