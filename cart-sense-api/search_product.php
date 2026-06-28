<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];

$query = $conn->prepare("
  SELECT * FROM product_catalog
  WHERE name LIKE ?
  LIMIT 5
");

$search = "%$name%";
$query->bind_param("s", $search);
$query->execute();

$result = $query->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>