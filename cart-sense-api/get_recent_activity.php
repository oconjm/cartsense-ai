<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

if ($conn->connect_error) {
    die(json_encode([
        "error" => "Database connection failed"
    ]));
}

$sql = "
SELECT 
    id,
    ref,
    total,
    created_at
FROM carts
ORDER BY created_at DESC
LIMIT 5
";

$result = $conn->query($sql);

$activities = [];

if ($result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {

        $activities[] = [
            "id" => (int)$row["id"],

            "user" => "Customer",

            "action" => "Placed order " . $row["ref"] .
                        " • ₱" . number_format($row["total"], 2),

            "time" => date(
                "M d, h:i A",
                strtotime($row["created_at"])
            )
        ];
    }
}

echo json_encode($activities);

$conn->close();
?>