<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

$sql = "
SELECT 
    DATE_FORMAT(created_at, '%b') as month,
    COUNT(*) as sales,
    SUM(total) as revenue
FROM carts
GROUP BY MONTH(created_at)
ORDER BY MONTH(created_at)
";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = [
        "month" => $row["month"],
        "sales" => (int)$row["sales"],
        "revenue" => (float)$row["revenue"]
    ];
}

echo json_encode($data);

$conn->close();
?>