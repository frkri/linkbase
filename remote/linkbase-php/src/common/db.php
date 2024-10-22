<?php
$db;

// Only parse the .env file once
if (!defined('DB_DEFINED')) {
    $db = new PDO($env['DB_CONN']);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Initialize the database
    $db->exec('create table if not exists user (
            userId integer primary key autoincrement,
            username text,
            password text)');

    $db->exec('create table if not exists objectStore (
            userId integer,
            file blob,
            createdAt integer,
            foreign key(userId) references user(userId))');

    $db->exec('create table if not exists session (
            userId integer,
            token text,
            createdAt integer,
            foreign key(userId) references user(id))');

    define('DB_DEFINED', true);
}
