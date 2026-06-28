<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$stmt = $conn->prepare("DELETE FROM products WHERE id=?");
$stmt->bind_param("i", $data->id);

$stmt->execute();

echo json_encode(["message" => "Deleted"]);
?>