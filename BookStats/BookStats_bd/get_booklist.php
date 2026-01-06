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

// Проверяем, что параметр email передан
if (isset($_GET['email'])) {
    $email = $conn->real_escape_string($_GET['email']);
    
    // Запрос для получения книг, связанных с указанным email
    $sql = "SELECT * FROM booklist WHERE user_email = '$email'";
    $result = $conn->query($sql);

    $booklist = array();

    // Проверка наличия книг
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $booklist[] = $row;
        }
        header("Content-Type: application/json");
        $response = array("status" => "success", "data" => $booklist);
    } else {
        header("Content-Type: application/json");
        $response = array("status" => "empty", "data" => "No books found");
    }
} else {
    // Если email не передан, возвращаем ошибку
    header("Content-Type: application/json");
    $response = array("status" => "error", "message" => "Email not provided");
}

// Возвращаем JSON-ответ
echo json_encode($response);
?>
