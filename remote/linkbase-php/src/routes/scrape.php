<?php
// Always allow preflight requests due to CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../middleware/auth.php';
require_once '../common/util.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$target = $data['url'] ?? null;
if (!isset($target)) {
    http_response_code(400);
    echo 'Bad Request: URL is required';
    exit;
}

$response = fetchContentWithCurl($target);
if ($response === false) {
    http_response_code(500);
    echo 'Failed to fetch the target URL';
    exit;
}

// Parse the HTML document
$doc = new DOMDocument();
libxml_use_internal_errors(true);
$doc->loadHTML($response['content']);
libxml_clear_errors();

$title = null;
$description = null;
$imgSrc = null;
$imgAlt = null;

// Extract the Open Graph meta tags
$metaTags = $doc->getElementsByTagName('meta');
foreach ($metaTags as $meta) {
    if ($meta->getAttribute('property') === 'og:title') {
        $title = $meta->getAttribute('content');
    } elseif ($meta->getAttribute('property') === 'og:description') {
        $description = $meta->getAttribute('content');
    } elseif ($meta->getAttribute('property') === 'og:image') {
        $imgSrc = $meta->getAttribute('content');
    } elseif ($meta->getAttribute('property') === 'og:image:alt') {
        $imgAlt = $meta->getAttribute('content');
    }
}

if (!$title) {
    $titleTags = $doc->getElementsByTagName('title');
    if ($titleTags->length > 0) {
        $title = $titleTags->item(0)->textContent;
    }
}

if (!$description) {
    foreach ($metaTags as $meta) {
        if ($meta->getAttribute('name') === 'description') {
            $description = $meta->getAttribute('content');
            break;
        }
    }
}

if (!$imgSrc) {
    $linkTags = $doc->getElementsByTagName('link');
    foreach ($linkTags as $link) {
        if ($link->getAttribute('rel') === 'icon' || $link->getAttribute('apple-touch-icon') === 'icon' || $link->getAttribute('rel') === 'shortcut icon') {
            $imgSrc = $link->getAttribute('href');
            break;
        }
    }

    // Fallback to the favicon
    if (!$imgSrc)
        $imgSrc = 'favicon.ico';
}

$imgBlob = null;
if ($imgSrc) {
    if (strpos($imgSrc, 'http') !== 0)
        $imgSrc = $target . "/" . $imgSrc;

    $imgBlob = fetchContentWithCurl($imgSrc);
    if ($imgBlob === false)
        $imgBlob = null;
}

$jsonData = json_encode([
    'url' => $target,
    'title' => $title,
    'description' => $description,
    'imgAlt' => $imgAlt
]);

$boundary = uniqid();
header('Content-Type: multipart/form-data; boundary=' . $boundary);

echo "--$boundary\r\n";
echo "Content-Disposition: form-data; name=\"json\"\r\n";
echo "Content-Type: application/json\r\n\r\n";
echo $jsonData . "\r\n";

if (isset($imgBlob)) {
    echo "--$boundary\r\n";
    echo "Content-Disposition: form-data; name=\"image\"; filename=\"image.png\"\r\n";
    echo "Content-Type: " . $imgBlob['content_type'] . "\r\n\r\n";
    echo $imgBlob['content'] . "\r\n";
}

echo "--$boundary--\r\n";
exit;
