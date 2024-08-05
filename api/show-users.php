<?php
require_once '../partials/connection.php';
$sql = "SELECT * FROM `users`";
$result = $conn->query($sql);
$users = $result->fetch_all(MYSQLI_ASSOC);
exit(json_encode($users));
