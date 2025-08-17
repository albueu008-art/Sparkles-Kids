<?php
require_once 'test_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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
    
    $headers = "From: noreply@sparkles-kids.com\r\n";
    $headers .= "Reply-To: noreply@sparkles-kids.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    $success = TEST_MODE ? 
        logEmail($to, $subject, $email_content, $headers) : 
        mail($to, $subject, $email_content, $headers);
    
    if($success) {
        echo json_encode(["status" => "success", "message" => "Recenzia a fost trimisă cu succes!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "A apărut o eroare. Vă rugăm încercați din nou."]);
    }
    exit;
}
?>
