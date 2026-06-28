<?php

$filename = "uploads/" . time() . ".jpg";

file_put_contents($filename, file_get_contents("php://input"));

// 🔥 Call Python YOLO
$command = "python detect.py " . $filename;
$output = shell_exec($command);

// Return result to ESP32
echo $output;

?>