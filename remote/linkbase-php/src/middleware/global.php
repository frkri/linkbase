<?php
require_once '../common/env.php';

# Set default headers
header('Access-Control-Allow-Origin: ' . $env['ALLOW_ORIGIN']);
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
