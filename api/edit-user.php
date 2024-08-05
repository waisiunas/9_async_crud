<?php
require_once '../partials/connection.php';
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['submit'])) {
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    $id = htmlspecialchars($data['id']);

    if (empty($name)) {
        exit(json_encode([
            'nameError' => 'Provide name from PHP!'
        ]));
    } elseif (empty($email)) {
        exit(json_encode([
            'emailError' => 'Provide email from PHP!'
        ]));
    } else {
        $sql = "SELECT * FROM `users` WHERE `email` = '$email' AND `id` != $id";
        $result = $conn->query($sql);
        if ($result->num_rows === 0) {
            $sql = "UPDATE `users` SET `name` = '$name', `email` = '$email' WHERE `id` = $id";
            if ($conn->query($sql)) {
                exit(json_encode([
                    'success' => 'Magic has been spelled!'
                ]));
            } else {
                exit(json_encode([
                    'failure' => 'Magic has failed to spell!'
                ]));
            }
        } else {
            exit(json_encode([
                'emailError' => 'Email already taken!'
            ]));
        }
    }
}
