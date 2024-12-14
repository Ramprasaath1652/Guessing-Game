<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "guessing_game";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Read POST data
$input = json_decode(file_get_contents("php://input"), true);
$name = $conn->real_escape_string($input['name']);
$moves = (int)$input['moves'];
$time = (int)$input['time'];

// Save score
$sql = "INSERT INTO scores (name, moves, time) VALUES ('$name', $moves, $time)";
$conn->query($sql);

// Calculate the best player
$result = $conn->query("SELECT name, MIN(moves + time) AS score FROM scores GROUP BY name ORDER BY score LIMIT 1");
$bestPlayer = $result->fetch_assoc();

echo json_encode(["bestPlayer" => $bestPlayer['name']]);

$conn->close();
?>
