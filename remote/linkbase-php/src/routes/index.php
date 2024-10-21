<?php
require __DIR__ . '/../../vendor/autoload.php';

use lbuchs\WebAuthn\WebAuthn;

$rpId = 'localhost';
session_start();

$post = trim(file_get_contents('php://input'));
if ($post)
    $post = json_decode($post, null, 512, JSON_THROW_ON_ERROR);

$auth = new WebAuthn('WebAuthn Library', $rpId);
// todo switch on create or get request

function createRegisterChallenge(WebAuthn $auth, string $userId, string $userName, string $userDisplayName)
{
    $challengeArgs = $auth->getCreateArgs(\hex2bin($userId), $userName, $userDisplayName);

    // Send the challenge to the client
    header('Content-Type: application/json');
    print(json_encode($challengeArgs));

    $_SESSION['challenge'] = $auth->getChallenge();
}

function verifyRegisterChallenge(WebAuthn $auth, $post)
{
    $clientDataJSON = !empty($post->clientDataJSON) ? base64_decode($post->clientDataJSON) : null;
    $attestationObject = !empty($post->attestationObject) ? base64_decode($post->attestationObject) : null;
    $challenge = $_SESSION['challenge'] ?? null;

    $userVerification = false;
    $requireUserPresent = true;
    $failIfRootMismatch = true;
    $requireCtsProfileMatch = false;

    $data = $auth->processCreate($clientDataJSON, $attestationObject, $challenge, $userVerification, $requireUserPresent, $failIfRootMismatch, $requireCtsProfileMatch);
    // todo store data in db

    // Send confirmation to the client
    $conf = new stdClass();
    $conf->success = true;
    $conf->msg = 'Registration successful';

    header('Content-Type: application/json');
    print(json_encode($conf));
}

exit;
