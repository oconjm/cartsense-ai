<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, stock=?, status=? WHERE id=?");
$stmt->bind_param("ssdssi",
    $data->name,
    $data->category,
    $data->price,
    $data->stock,
    $data->status,
    $data->id
);

$stmt->execute();

echo json_encode(["message" => "Updated"]);
?>