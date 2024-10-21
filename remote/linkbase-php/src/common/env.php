<?php
$env;

// Only parse the .env file once
if (!defined('ENV_DEFINED')) {
    $env = parse_ini_file('../../.env');
    define('ENV_DEFINED', true);
}