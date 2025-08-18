<?php
require_once 'test_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Enable error reporting during testing
    if (TEST_MODE) {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }
    
    // Validate required fields
    if(empty($_POST['name']) || empty($_POST['message']) || empty($_POST['rating'])) {
        echo json_encode(["status" => "error", "message" => "Vă rugăm completați toate câmpurile necesare."]);
        exit;
    }

    $name = htmlspecialchars($_POST['name']);
    $message = htmlspecialchars($_POST['message']);
    $rating = htmlspecialchars($_POST['rating']);
    
    $to = TEST_MODE ? TEST_EMAIL : "albueu008@gmail.com";
    $subject = "Nouă recenzie SparklesKids";
    
    $email_content = "Nume: $name\n\n";
    $email_content .= "Rating: $rating stele\n\n";
    $email_content .= "Mesaj:\n$message\n";
    
    $success = sendEmail($to, $subject, $email_content, $name);
    
    if($success) {
        echo json_encode(["status" => "success", "message" => "Recenzia a fost trimisă cu succes!"]);
    } else {
        $error = error_get_last();
        $errorMsg = $error ? $error['message'] : 'Unknown error';
        error_log("Mail Handler Error: " . $errorMsg);
        echo json_encode(["status" => "error", "message" => "A apărut o eroare. Vă rugăm încercați din nou. (Error: " . $errorMsg . ")"]);
    }
    exit;
}
?>
