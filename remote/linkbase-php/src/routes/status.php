<?php
require_once '../common/session.php';
require_once '../common/db.php';

$user = false;
if (isset($_POST['logout'])) {
    unset($_COOKIE[$cookieName]);
    setcookie($cookieName, '', time() - 3600);
} else if (isset($_COOKIE[$cookieName])) {
    $cookie = $_COOKIE[$cookieName];
    $session = getSession($cookie);

    if ($session) {
        $stmt =  $db->prepare("SELECT * FROM user WHERE userId = :userId limit 1");
        $status = $stmt->execute([':userId' => $session['userId']]);

        if ($status)
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

if (!$user) {
    header('Location: index.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="static/favicon.svg" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status</title>
</head>

<body>
    <div id="loggedIn">
        <h1><?= $user['username'] ?></h1>
        <p>You are logged in, you may close this windows.</p>
        <form method="post">
            <input type="hidden" name="logout" value="true">
            <button type="submit" name="logout">Logout</button>
        </form>
    </div>
</body>

</html>


<style>
    @font-face {
        font-family: 'Geist';
        font-display: swap;
        src: url(static/font/Geist.woff2) format('woff2');
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        height: 100vh;
        width: 100%;

        overflow: hidden;

        background-color: #1c1917;
        color: #e5e5e5;

        &>* {
            font-family: 'Geist', 'sans-serif';
            font-weight: 400;
            font-size: 1rem;
        }
    }

    #loggedIn {    
    &> h1 {
            font-weight: 600;
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 1rem;
        }

        &> p {
            margin-bottom: 4rem;
            text-align: center;
        }

        &> form button {
            transition: all 120ms ease-in-out;
            border: none;
            cursor: pointer;

            border: solid 1px #f5f5f4;
            border-radius: 2px;
            background-color: #f5f5f4;

            width: 100%;
            padding: 0.5rem;

            font-family: inherit;
            font-weight: 600;

            &:hover,
            &:focus {
                background-color: transparent;
                color: #f5f5f4;
            }
        }
    }
</style>