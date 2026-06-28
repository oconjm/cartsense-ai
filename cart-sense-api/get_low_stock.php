<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

if ($conn->connect_error) {
    die(json_encode([
        "error" => "Database connection failed"
    ]));
}

$sql = "SELECT id, name, stock 
        FROM products 
        WHERE stock < 20
        ORDER BY stock ASC";

$result = $conn->query($sql);

$items = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = [
            "id" => (int)$row["id"],
            "name" => $row["name"],
            "stock" => (int)$row["stock"]
        ];
    }
}

echo json_encode($items);

$conn->close();
?>