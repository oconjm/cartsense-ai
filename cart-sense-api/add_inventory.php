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

$stmt = $conn->prepare("
  INSERT INTO inventory (name, sku, in_stock, reorder_level, location)
  VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
  "sssis",
  $data->name,
  $data->sku,
  $data->in_stock,
  $data->reorder_level,
  $data->location
);

$stmt->execute();

echo json_encode(["message" => "Item added"]);