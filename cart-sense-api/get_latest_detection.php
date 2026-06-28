<?php

header("Content-Type: application/json");

include "db.php";

$sql = "
SELECT product_name
FROM cart_items
ORDER BY id DESC
LIMIT 1
";

$result = $conn->query($sql);

echo json_encode($result->fetch_assoc());
?>