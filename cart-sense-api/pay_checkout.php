<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"];

$stmt = $conn->prepare("
  UPDATE checkouts SET status='paid' WHERE id=?
");

$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status"=>"success"]);
?>