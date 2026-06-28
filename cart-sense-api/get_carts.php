<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// ================= CHECK DB CONNECTION =================
if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// ================= RUN QUERY =================
$result = $conn->query("SELECT * FROM carts");

// ================= ERROR CHECK =================
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Query failed"
    ]);
    exit;
}

// ================= BUILD RESPONSE =================
$carts = [];

while ($row = $result->fetch_assoc()) {
    $carts[] = $row;
}

// ================= OUTPUT =================
echo json_encode([
    "success" => true,
    "count" => count($carts),
    "data" => $carts
]);
?>