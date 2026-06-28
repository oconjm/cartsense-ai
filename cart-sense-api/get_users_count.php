<?php
include 'db.php';

$sql = "SELECT COUNT(*) as total FROM users";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

echo json_encode($row);
?>