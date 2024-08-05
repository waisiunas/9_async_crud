<?php
require_once '../partials/connection.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = htmlspecialchars( $data['id']);
$sql = "SELECT * FROM `users` WHERE `id` = $id";
$result = $conn->query($sql);
$user = $result->fetch_assoc();
exit(json_encode($user));
