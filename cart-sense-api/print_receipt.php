<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: text/html; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents("php://input"), true);

// fallback safety
if (!$data || !isset($data['items'])) {
    echo "<h3>Invalid receipt data</h3>";
    exit;
}

// ================= ITEMS =================
$items_html = "";

foreach ($data['items'] as $item) {

    $name = $item['name'] ?? 'Unknown Item';
    $qty = $item['quantity'] ?? 1;
    $price = $item['price'] ?? 0;

    $subtotal = floatval($price) * floatval($qty);

    $items_html .= "
        <tr>
            <td class='item'>{$name} x{$qty}</td>
            <td class='price'>₱" . number_format($subtotal, 2) . "</td>
        </tr>
    ";
}

// ================= HEADER DATA =================
$total = number_format(floatval($data['total'] ?? 0), 2);
$cart = htmlspecialchars($data['cart_name'] ?? 'Cart');
$cashier = htmlspecialchars($data['cashier'] ?? 'Staff');
$date = $data['date'] ?? date("Y-m-d H:i:s");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Receipt</title>

    <style>
        body {
            width: 80mm;
            font-family: "Courier New", monospace;
            font-size: 12px;
            margin: 0;
            padding: 10px;
            color: #000;
        }

        .center {
            text-align: center;
        }

        .header {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        td {
            padding: 3px 0;
            vertical-align: top;
        }

        .item {
            text-align: left;
        }

        .price {
            text-align: right;
            white-space: nowrap;
        }

        .line {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }

        .total-row td {
            border-top: 1px solid #000;
            font-weight: bold;
            padding-top: 5px;
        }

        .footer {
            text-align: center;
            margin-top: 10px;
        }

        button {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            font-size: 14px;
        }

       @media print {
    body {
        width: 100%;
        margin: 0;
        padding: 20px;
        font-family: "Courier New", monospace;
    }

    table {
        width: 100%;
    }

    td {
        font-size: 14px;
        padding: 5px 0;
    }

    button {
        display: none;
    }

    @page {
        size: A4;
        margin: 10mm;
    }

}
    </style>
</head>

<body>

<div class="center header">
    <h3>SMART POS RECEIPT</h3>

    <div class="line"></div>

    Cart: <?= $cart ?><br>
    Cashier: <?= $cashier ?><br>
    Date: <?= $date ?>
</div>

<table>
    <?= $items_html ?>

    <tr class="total-row">
        <td>TOTAL</td>
        <td class="price">₱<?= $total ?></td>
    </tr>
</table>

<div class="footer">
    <div class="line"></div>
    Thank you for shopping!
</div>

<button onclick="window.print()">🖨️ Print Receipt</button>

</body>
</html>