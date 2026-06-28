<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdss",
    $data->name,
    $data->category,
    $data->price,
    $data->stock,
    $data->status
);

$stmt->execute();

echo json_encode(["message" => "Product created"]);
?>