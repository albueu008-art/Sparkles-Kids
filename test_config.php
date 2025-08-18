<?php
// Configuration
define('TEST_MODE', false);
define('SITE_EMAIL', 'albueu008@gmail.com');
define('TEST_EMAIL', 'albueu008@gmail.com'); // Same as SITE_EMAIL for testing
define('SMTP_HOST', 'smtp-relay.brevo.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'albueu008@gmail.com'); // Your Brevo account email
define('SMTP_PASS', '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'); // You'll need to add your Brevo SMTP key here

function sendEmail($to, $subject, $message, $from_name = 'SparklesKids') {
    if (TEST_MODE) {
        return logEmail($to, $subject, $message, $from_name);
    }

    $headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $from_name . ' <' . SITE_EMAIL . '>',
        'Reply-To: ' . SITE_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    );

    // Initialize cURL
    $curl = curl_init();
    
    // Brevo API endpoint
    curl_setopt($curl, CURLOPT_URL, 'https://api.brevo.com/v3/smtp/email');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    
    // Set headers
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'accept: application/json',
        'api-key: ' . SMTP_PASS,
        'content-type: application/json'
    ));
    
    // Prepare email data
    $email_data = array(
        'sender' => array(
            'name' => $from_name,
            'email' => SITE_EMAIL
        ),
        'to' => array(
            array(
                'email' => $to,
                'name' => 'Recipient'
            )
        ),
        'subject' => $subject,
        'htmlContent' => nl2br($message)
    );
    
    // Set request body
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($email_data));
    
    // Execute request
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    
    if ($err) {
        error_log('Email Error: ' . $err);
        return false;
    }
    
    return true;
}

// Keep logging function for test mode
function logEmail($to, $subject, $message, $from_name) {
    try {
        // Debug information
        $debugInfo = array(
            'Directory' => __DIR__,
            'Is Directory Writable' => is_writable(__DIR__) ? 'Yes' : 'No',
            'PHP Version' => phpversion(),
            'Current User' => get_current_user(),
            'Current Permissions' => fileperms(__DIR__)
        );
        
        error_log("Debug Info: " . print_r($debugInfo, true));
        
        $log = date('Y-m-d H:i:s') . "\n";
        $log .= "From: " . $from_name . " <" . SITE_EMAIL . ">\n";
        $log .= "To: $to\n";
        $log .= "Subject: $subject\n";
        $log .= "Message:\n$message\n";
        $log .= "----------------------------------------\n";
        
        $logPath = __DIR__ . '/email_logs.txt';
        
        // Try to create a test file first
        $testFile = __DIR__ . '/test_write.txt';
        if (@file_put_contents($testFile, 'test') === false) {
            throw new Exception("Cannot write to directory. Test file creation failed.");
        }
        @unlink($testFile); // Clean up test file
        
        // Try to write to log file
        $result = @file_put_contents($logPath, $log, FILE_APPEND);
        if ($result === false) {
            $error = error_get_last();
            throw new Exception("Failed to write to log file: " . $error['message']);
        }
        
        return true;
    } catch (Exception $e) {
        // In test mode, we want to see the error
        if (TEST_MODE) {
            echo json_encode([
                "status" => "error", 
                "message" => "Error during test mode: " . $e->getMessage(),
                "debug" => $debugInfo
            ]);
            exit;
        }
        error_log("LogEmail Error: " . $e->getMessage());
        return false;
    }
}
?>

