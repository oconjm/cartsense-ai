<?php
include "db.php";

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Extract data from the request
$user_id    = $data['user_id'];
$cart_id    = $data['cartId']; // Captured from the frontend activeCart state
$name       = $data['name'];
$weight     = $data['weight_grams'] ?? 0; // Defaulting to 0 if not provided
$price      = $data['price'];
$quantity   = $data['quantity'];
$expiry     = $data['expiry_date'] ?? null;
$stock      = $data['stock'] ?? 0;

/**
 * We use a prepared statement to insert into cart_items. 
 * This ensures the item is linked to the specific cart being viewed on screen.
 */
$stmt = $conn->prepare("INSERT INTO cart_items (cart_id, user_id, name, weight_grams, price, quantity, expiry_date, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

// "ssisdisi" corresponds to the types: string, string, string, int, double, int, string, int
$stmt->bind_param("sssidisi", $cart_id, $user_id, $name, $weight, $price, $quantity, $expiry, $stock);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Item added to cart $cart_id"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>