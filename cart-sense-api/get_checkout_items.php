<?php
include "db.php";

// ================= HEADERS =================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// ================= INPUT =================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// ================= VALIDATION =================
if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON input"
    ]);
    exit;
}

$ref = $data["ref"] ?? null;
$total = $data["total"] ?? 0;
$items = $data["items"] ?? [];

if (!$ref || empty($items)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

// ================= OPTIONAL DB INSERT (SAFE) =================
$stmt = $conn->prepare("INSERT INTO checkout (ref, total) VALUES (?, ?)");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "DB prepare failed"
    ]);
    exit;
}

$stmt->bind_param("sd", $ref, $total);
$stmt->execute();

$checkout_id = $stmt->insert_id;

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "cartId" => $checkout_id,
    "ref" => $ref,
    "total" => $total,
    "itemCount" => count($items)
]);

