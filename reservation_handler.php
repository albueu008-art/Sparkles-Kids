<?php
require_once 'test_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate required fields
    $required_fields = ['nume', 'copil', 'data', 'tip', 'telefon'];
    foreach($required_fields as $field) {
        if(empty($_POST[$field])) {
            echo json_encode(["status" => "error", "message" => "Vă rugăm completați toate câmpurile necesare."]);
            exit;
        }
    }
    
    $parent_name = htmlspecialchars($_POST['nume']);
    $child_name = htmlspecialchars($_POST['copil']);
    $date = htmlspecialchars($_POST['data']);
    $party_type = htmlspecialchars($_POST['tip']);
    $phone = htmlspecialchars($_POST['telefon']);
    $message = !empty($_POST['mesaj']) ? htmlspecialchars($_POST['mesaj']) : "Niciun mesaj adițional";
    
    $to = TEST_MODE ? TEST_EMAIL : "albueu008@gmail.com";
    $subject = "Nouă rezervare SparklesKids";
    
    $email_content = "DETALII REZERVARE:\n\n";
    $email_content .= "Nume părinte: $parent_name\n";
    $email_content .= "Nume copil: $child_name\n";
    $email_content .= "Data petrecerii: $date\n";
    $email_content .= "Tip petrecere: $party_type\n";
    $email_content .= "Telefon: $phone\n";
    $email_content .= "Mesaj:\n$message\n";
    
    $success = sendEmail($to, $subject, $email_content, "SparklesKids");
    
    if($success) {
        echo json_encode(["status" => "success", "message" => "Rezervarea a fost trimisă cu succes!"]);
    } else {
        $error = error_get_last();
        $errorMsg = $error ? $error['message'] : 'Unknown error';
        error_log("Reservation Handler Error: " . $errorMsg);
        echo json_encode(["status" => "error", "message" => "A apărut o eroare. Vă rugăm încercați din nou. (Error: " . $errorMsg . ")"]);
    }
    exit;
}
?>
