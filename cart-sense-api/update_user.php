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

$id = $data->id;
$name = $data->name;
$email = $data->email;
$role = $data->role;

$stmt = $conn->prepare("UPDATE users SET name=?, email=?, role=? WHERE id=?");
$stmt->bind_param("sssi", $name, $email, $role, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "User updated"]);
} else {
    echo json_encode(["message" => "Failed to update"]);
}
?>