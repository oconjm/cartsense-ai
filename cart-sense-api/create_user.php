<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";

$data = json_decode(file_get_contents("php://input"));

$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)");

$stmt->execute([
    $data->name,
    $data->email,
    password_hash($data->password, PASSWORD_DEFAULT),
    $data->role
]);

echo json_encode(["message" => "User created"]);
?>