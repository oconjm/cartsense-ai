<?php

header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "Cart2026Sense", "cart_sense_db");

$cart_id = isset($_GET['cart_id']) ? intval($_GET['cart_id']) : 14;

/* 🔥 GROUP ITEMS PROPERLY */
$sql = "
SELECT 
    item,
    SUM(quantity) as quantity,
    price
FROM cart_items
WHERE cart_id = $cart_id
GROUP BY item, price
";

$result = $conn->query($sql);

$items = [];
$total = 0;

while ($row = $result->fetch_assoc()) {

    $qty = intval($row["quantity"]);
    $price = floatval($row["price"]);
    $subtotal = $qty * $price;

    $total += $subtotal;

    $items[] = [
        "item" => $row["item"],
        "price" => $price,
        "quantity" => $qty,
        "subtotal" => $subtotal
    ];
}

echo json_encode([
    "success" => true,
    "items" => $items,
    "total" => $total
]);

?>