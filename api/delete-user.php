<?php
require_once '../partials/connection.php';
$data = json_decode(file_get_contents('php://input'), true);

$id = htmlspecialchars($data['id']);

$sql = "DELETE FROM `users` WHERE `id` = $id";
if ($conn->query($sql)) {
    exit(json_encode([
        'success' => 'Magic has been spelled!'
    ]));
} else {
    exit(json_encode([
        'failure' => 'Magic has failed to spell!'
    ]));
}
