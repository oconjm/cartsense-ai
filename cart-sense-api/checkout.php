<?php
include "db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

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

$conn->begin_transaction();

try {

    // ✅ INSERT INTO carts (NOT checkout anymore)
    $stmt = $conn->prepare("INSERT INTO carts (ref, total) VALUES (?, ?)");

    if (!$stmt) {
        throw new Exception("Cart insert prepare failed");
    }

    $stmt->bind_param("sd", $ref, $total);
    $stmt->execute();

    // get the last insert id from the connection to ensure correct cart_id
    $cart_id = (int)$conn->insert_id;
    $stmt->close();

    // ✅ INSERT cart items
    $itemStmt = $conn->prepare("INSERT INTO cart_items (cart_id, item, price, quantity) VALUES (?, ?, ?, ?)");

    if (!$itemStmt) {
        throw new Exception("Cart items prepare failed");
    }

    foreach ($items as $it) {
        $name = $it["name"] ?? "";
        $price = $it["price"] ?? 0;
        $qty = $it["quantity"] ?? 1;

        // ensure correct PHP types for bind_param (by reference)
        $cartIdParam = (int)$cart_id;
        $nameParam = (string)$name;
        $priceParam = (float)$price;
        $qtyParam = (int)$qty;

        $itemStmt->bind_param("isdi", $cartIdParam, $nameParam, $priceParam, $qtyParam);
        $itemStmt->execute();
    }

    $itemStmt->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "cartId" => $cart_id,
        "ref" => $ref,
        "total" => $total,
        "itemCount" => count($items)
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
?>