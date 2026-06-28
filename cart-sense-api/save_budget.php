<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$budget = $data['budget'];

$conn->query("DELETE FROM budgets WHERE user_id='$user_id'");
$conn->query("INSERT INTO budgets (user_id, budget) VALUES ('$user_id','$budget')");

echo json_encode(["status" => "saved"]);
?>