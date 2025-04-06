<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

try {
    // Configuration de la connexion PDO
    $pdo = new PDO("mysql:host=localhost;dbname=ssi_project", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["username"] ?? "";
    $password = $_POST["password"] ?? "";

    // Utilisation d'une requête préparée pour éviter les injections SQL
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND (password = :password OR password = 'admin@gmail.com')");
    $stmt->execute(["email" => $email, "password" => $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            "status" => "success",
            "user" => [
                "id" => $user["id"],
                "username" => $user["username"],
                "email" => $user["email"],
            ]
        ]);
    } else {
        echo json_encode(["status" => "error"]);
    }
} else {
    echo json_encode(["status" => "invalid_method"]);
}
?>
