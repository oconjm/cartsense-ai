<?php

include "db.php";

$ref = "CART-" . time();

$sql = "INSERT INTO carts(ref,total)
        VALUES('$ref',0)";

if(mysqli_query($conn,$sql))
{
    echo json_encode([
        "success" => true,
        "cart_id" => mysqli_insert_id($conn),
        "ref" => $ref
    ]);
}
else
{
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
}

?>