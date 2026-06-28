<?php
header("Content-Type: application/json");
include "db.php"; // your connection file

$data = json_decode(file_get_contents("php://input"), true);

$cart_id = 14;
$item = $data["item"];
$confidence = $data["confidence"];

// optional: price (you can hardcode or lookup later)
$price = 0;
$quantity = 1;

// check if item already exists in cart
$check = $conn->prepare("SELECT id, quantity FROM cart_items WHERE cart_id=? AND item=?");
$check->bind_param("is", $cart_id, $item);
$check->execute();
$result = $check->get_result();

if ($row = $result->fetch_assoc()) {

    // update quantity
    $newQty = $row["quantity"] + 1;

    $update = $conn->prepare("UPDATE cart_items SET quantity=? WHERE id=?");
    $update->bind_param("ii", $newQty, $row["id"]);
    $update->execute();

} else {

    // insert new item
    $insert = $conn->prepare("
        INSERT INTO cart_items (cart_id, item, price, quantity)
        VALUES (?, ?, ?, ?)
    ");

    $insert->bind_param("isdi", $cart_id, $item, $price, $quantity);
    $insert->execute();
}

echo json_encode([
    "status" => "saved",
    "item" => $item,
    "confidence" => $confidence
]);
?>