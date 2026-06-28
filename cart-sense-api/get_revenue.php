<?php
include 'db.php';

$sql = "SELECT SUM(total) as total FROM carts";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

echo json_encode([
    "total" => $row['total'] ?? 0
]);
?>