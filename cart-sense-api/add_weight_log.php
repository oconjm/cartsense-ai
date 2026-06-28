<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$cart_id = $data['cart_id'];
$weight_before = $data['weight_before'];
$weight_after = $data['weight_after'];
$weight_change = $data['weight_change'];
$predicted_product = $data['predicted_product'];
$confidence = $data['confidence'];
$action = $data['action'];

$sql = "
INSERT INTO weight_logs
(
cart_id,
weight_before,
weight_after,
weight_change,
predicted_product,
confidence,
action
)
VALUES
(
'$cart_id',
'$weight_before',
'$weight_after',
'$weight_change',
'$predicted_product',
'$confidence',
'$action'
)
";

if(mysqli_query($conn, $sql)){
    echo json_encode([
        'success' => true
    ]);
}else{
    echo json_encode([
        'success' => false,
        'error' => mysqli_error($conn)
    ]);
}
?>