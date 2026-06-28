<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

$sql = "
SELECT 
    p.name,
    SUM(ci.quantity) as units,
    SUM(ci.quantity * ci.price) as revenue
FROM cart_items ci
INNER JOIN products p ON ci.product_id = p.id
GROUP BY ci.product_id
ORDER BY units DESC
LIMIT 4
";

$result = $conn->query($sql);

$products = [];

while($row = $result->fetch_assoc()) {
    $products[] = [
        "name" => $row["name"],
        "units" => (int)$row["units"],
        "revenue" => number_format($row["revenue"], 2)
    ];
}

echo json_encode($products);

$conn->close();
?>