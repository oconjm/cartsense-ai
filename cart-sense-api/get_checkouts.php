<?php
include "db.php";

$result = $conn->query("
  SELECT * FROM checkouts WHERE status='pending'
");

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>