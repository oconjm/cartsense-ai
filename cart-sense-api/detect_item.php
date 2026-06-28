<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

// ================= READ INPUT =================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["weight"])) {
    echo json_encode([
        "success" => false,
        "message" => "No weight received"
    ]);
    exit;
}

$weight = floatval($data["weight"]);

// ================= SAMPLE LOGIC =================
// You will replace this with database lookup later

if ($weight > 100) {
    $item = "Rice";
    $price_per_kg = 60;
} elseif ($weight > 50) {
    $item = "Sugar";
    $price_per_kg = 80;
} else {
    $item = "Milk";
    $price_per_kg = 50;
}

$total = ($weight / 1000) * $price_per_kg;

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "item" => $item,
    "weight" => $weight,
    "price_per_kg" => $price_per_kg,
    "total_price" => $total
]);
?>