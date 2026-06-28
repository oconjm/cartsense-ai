<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$cart_id = $data["cart_id"];
$product_label = $data["product_label"];
$weight_change = $data["weight_change"];
$confidence = $data["confidence"];

// Find product
$productQuery = mysqli_query(
    $conn,
    "SELECT * FROM products
     WHERE image_label='$product_label'
     LIMIT 1"
);

if(mysqli_num_rows($productQuery) == 0){
    die("PRODUCT_NOT_FOUND");
}

$product = mysqli_fetch_assoc($productQuery);

$product_id = $product["id"];
$item_name = $product["name"];
$price = $product["price"];
$expected_weight = $product["expected_weight"];

// Verify weight
$difference = abs($expected_weight - $weight_change);

if($difference > 50){
    die("WEIGHT_MISMATCH");
}

// Check if already exists in cart
$existing = mysqli_query(
    $conn,
    "SELECT * FROM cart_items
     WHERE cart_id='$cart_id'
     AND product_id='$product_id'"
);

if(mysqli_num_rows($existing) > 0){

    mysqli_query(
        $conn,
        "UPDATE cart_items
         SET quantity = quantity + 1
         WHERE cart_id='$cart_id'
         AND product_id='$product_id'"
    );

} else {

    mysqli_query(
        $conn,
        "INSERT INTO cart_items
        (
            cart_id,
            product_id,
            item,
            price,
            quantity
        )
        VALUES
        (
            '$cart_id',
            '$product_id',
            '$item_name',
            '$price',
            1
        )"
    );
}

echo "SUCCESS";
?>