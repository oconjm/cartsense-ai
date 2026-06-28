<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

// READ RAW JSON FROM ESP32
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON"
    ]);
    exit();
}

$item = $data['item'];
$price = $data['price'];
$quantity = $data['quantity'];
$cart_id = $data['cart_id'];

// SAFE INSERT (IMPORTANT FIX)
$stmt = $conn->prepare("
    INSERT INTO cart_items (cart_id, item, price, quantity)
    VALUES (?, ?, ?, ?)
");

$stmt->bind_param("isdi", $cart_id, $item, $price, $quantity);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed"
    ]);
}
?>