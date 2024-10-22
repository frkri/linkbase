<?php
require_once '../common/session.php';
require_once '../common/db.php';

$errorMsg = '';
$session = false;
if (isset($_COOKIE[$cookieName])) {
    $cookie = $_COOKIE[$cookieName];
    $session = getSession($cookie);

    if ($session) {
        header('Location: status.php');
        exit();
    } else {
        // Invalid session, clear the cookie
        unset($_COOKIE[$cookieName]);
        setcookie($cookieName, '', time() - 3600);
    }
} else if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    if (isset($_POST['login'])) {
        if (loginUser($username, $password)) {
            header('Location: status.php');
            exit();
        }
    } else if (isset($_POST['register'])) {
        if (registerUser($username, $password)) {
            header('Location: status.php');
            exit();
        }
    }
}

function registerUser(string $username, string $password)
{
    global $db, $errorMsg;

    $lenUsername = strlen($username);
    $lenPassword = strlen($password);

    if ($lenUsername <= 3 || $lenPassword <= 3 || $lenUsername >= 12 || $lenPassword >= 32) {
        $errorMsg = 'Username and password must be between 3 and 12 characters';
        return false;
    }

    $stmt = $db->prepare("SELECT * FROM user WHERE username = :username limit 1");
    $status = $stmt->execute([':username' => $username]);

    if ($status && $stmt->fetch(PDO::FETCH_ASSOC)) {
        $errorMsg = 'Registration failed. Please try again.';
        return false;
    }

    $stmt = $db->prepare("INSERT INTO user (username, password) VALUES (:username, :password)");
    $status = $stmt->execute([':username' => $username, ':password' => password_hash($password, PASSWORD_DEFAULT)]);

    $lastId = $db->lastInsertId();
    if ($status && $lastId)
        setSession($lastId);

    return true;
}

function loginUser(string $username, string $password)
{
    global $db, $errorMsg;

    $stmt = $db->prepare("SELECT * FROM user WHERE username = :username limit 1");
    $status = $stmt->execute([':username' => $username]);

    if ($status) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            setSession($user['userId']);
            return true;
        }
    }

    $errorMsg = 'Invalid username or password';
    return false;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="static/favicon.svg" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth</title>
</head>

<body>
    <div id="loggedOut">
        <form method="post">
            <h1>Register</h1>
            <input type="hidden" name="register" value="true">
            <input type="text" name="username" id="username" placeholder="Username" required>
            <input type="password" name="password" id="password" placeholder="Password" autocomplete="new-password" required>
            <button type="submit">Register</button>
        </form>
        <form method="post">
            <h1>Login</h1>
            <input type="hidden" name="login" value="true">
            <input type="username" name="username" id="username" placeholder="Username" required>
            <input type="password" name="password" id="password" placeholder="Password" required>
            <button type="submit" value="Submit">Login</button>
        </form>
    </div>
    <p>
        <?= $errorMsg ?>
    </p>
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;

        height: 100vh;
        width: 100%;

        overflow-x: hidden;
        overflow-y: auto;

        background-color: #1c1917;
        color: #e5e5e5;

        &>* {
            font-family: 'Geist', 'sans-serif';
            font-weight: 400;
            font-size: 1rem;
        }

        &>p {
            text-align: center;
            margin: 0rem 2rem;
        }
    }

    #loggedOut {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 768px) {
        #loggedOut {
            flex-direction: column;

            & form:nth-child(1) {

                margin-bottom: 2rem;

                &::after {
                    display: none;
                }
            }
        }
    }

    #loggedOut form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        position: relative;
        padding: 0 2rem;

        &>button {
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

        &>h1 {
            font-size: 2rem;
            font-weight: 600;

            margin-bottom: 2rem;
        }

        &>input {
            border: solid 1px #737373;
            border-radius: 2px;
            background-color: transparent;
            color: #e5e5e5;

            width: 100%;
            padding: 0.5rem;

            font-family: inherit;
            font-weight: 400;

            &::placeholder {
                color: #e5e5e5;
            }
        }

        &:nth-child(1)::after {
            content: "";
            position: absolute;

            border-radius: 1rem;
            background-color: #e5e5e5;

            transform: translateX(50%);
            right: 0px;

            width: 1px;
            height: 100%;
        }
    }
</style>