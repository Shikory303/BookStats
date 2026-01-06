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
//запрос на публикацию данных
$data = json_decode(file_get_contents("php://input"));
//Проверяем, что все значения были переданы корректно
if (isset($data->email) && isset($data->bookname) && isset($data->author) && isset($data->pages)) {
    $user_email = $conn->real_escape_string($data->email);
    $bookname = $conn->real_escape_string($data->bookname);
    $author = $conn->real_escape_string($data->author);
    $pages = (int)$data->pages;
    
    $sql = "INSERT INTO booklist (user_email, bookname, author, pages) VALUES ('$user_email','$bookname','$author','$pages')";
    if ($conn->query($sql) === TRUE) {
        header("Content-Type: application/json");
        $response = array("status" => "success", "message" => "Book added successfully");
    } else {
        header("Content-Type: application/json");
        $response = array("status" => "error", "message" => "Error: " . $conn->error);
    }
}
else {
    $response = array("status" => "error", "message" => "Invalid data");
}
echo json_encode($response);
?>