<?php
// ================= CORS FIX =================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// IMPORTANT: Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";

$data = json_decode(file_get_contents("php://input"));

$stmt = $conn->prepare("UPDATE inventory SET in_stock=? WHERE id=?");

$stmt->bind_param("ii", $data->in_stock, $data->id);

$stmt->execute();

echo json_encode(["message" => "Stock updated"]);