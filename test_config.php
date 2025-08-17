<?php
// Test mode configuration
define('TEST_MODE', false);
define('TEST_EMAIL', 'albueu008@gmail.com');

// Function to log emails instead of sending them
function logEmail($to, $subject, $message, $headers) {
    $log = date('Y-m-d H:i:s') . "\n";
    $log .= "To: $to\n";
    $log .= "Subject: $subject\n";
    $log .= "Message:\n$message\n";
    $log .= "Headers:\n$headers\n";
    $log .= "----------------------------------------\n";
    
    file_put_contents('email_logs.txt', $log, FILE_APPEND);
    return true;
}
?>
