<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "zhuravl_Shikory";
$password = "bkmz0725";
$dbname = "zhuravl_database";

// Создаем соединение с базой данных
$conn = new mysqli($servername, $username, $password, $dbname);
// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//Обработка запроса на получение данных
$sql = "SELECT * FROM users";
$result = $conn->query($sql);
$users = array();
//Проверяем, что таблица на пустоту
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    header("Content-Type: application/json");
    $response = array("status" => "success", "data" => $users);
}
else {
    header("Content-Type: application/json");
    $response = array("status" => "empty", "data" => "No users found");
}
echo json_encode($response);
?>
