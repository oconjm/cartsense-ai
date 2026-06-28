<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';


// ================= INVENTORY =================
$inventory = [];
$res = $conn->query("SELECT * FROM inventory");

while ($row = $res->fetch_assoc()) {
    $inventory[] = $row;
}


// ================= USERS =================
$users = [];
$res = $conn->query("SELECT id, name, email, role, created_at FROM users");

while ($row = $res->fetch_assoc()) {
    $users[] = $row;
}


// ================= USER ACTIVITY =================
$userActivity = [
    ["activity" => "Total Users", "count" => count($users)],
    ["activity" => "Admins", "count" => count(array_filter($users, fn($u) => $u['role'] == 'admin'))],
    ["activity" => "Cashiers", "count" => count(array_filter($users, fn($u) => $u['role'] == 'cashier'))],
    ["activity" => "Customers", "count" => count(array_filter($users, fn($u) => $u['role'] == 'user'))],
];


// ================= SALES (FROM CARTS) =================
// ⚠️ THIS NEEDS YOUR carts/cart_items TABLE
$salesSummary = [];

if ($conn->query("SHOW TABLES LIKE 'cart_items'")->num_rows > 0) {

    $res = $conn->query("
        SELECT 
            sku AS category,
            SUM(quantity) AS sales,
            SUM(quantity * price) AS revenue
        FROM cart_items
        GROUP BY sku
    ");

    while ($row = $res->fetch_assoc()) {
        $row['revenue'] = "₱" . number_format($row['revenue'], 2);
        $salesSummary[] = $row;
    }
}


// ================= REPORT SUMMARY =================
$totalRevenue = 0;
$totalUnits = 0;

if ($conn->query("SHOW TABLES LIKE 'cart_items'")->num_rows > 0) {

    $r1 = $conn->query("SELECT SUM(quantity * price) AS total FROM cart_items");
    $totalRevenue = $r1->fetch_assoc()['total'] ?? 0;

    $r2 = $conn->query("SELECT SUM(quantity) AS total FROM cart_items");
    $totalUnits = $r2->fetch_assoc()['total'] ?? 0;
}

$summary = [
    "total_revenue" => "₱" . number_format($totalRevenue, 2),
    "total_units" => $totalUnits,
    "active_users" => count($users),
    "best_category" => "From sales data"
];


// ================= OUTPUT =================
echo json_encode([
    "inventory" => $inventory,
    "users" => $users,
    "userActivity" => $userActivity,
    "salesSummary" => $salesSummary,
    "summary" => $summary
]);
?>