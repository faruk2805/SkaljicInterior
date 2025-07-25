<?php
header('Content-Type: application/json');

// Google reCAPTCHA secret key
$secretKey = "6LeGJIwrAAAAAKZnlhE8s_yFdYPbfwe1oR1udRrC";

// Email settings
$toEmail = "info@skaljicinterior.com";
$fromEmail = "info@skaljicinterior.com";
$subject = "Nova poruka sa kontakt forme";

// Verify reCAPTCHA
if (isset($_POST['g-recaptcha-response'])) {
    $recaptchaResponse = $_POST['g-recaptcha-response'];
    $verifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaResponse}";
    $verifyResponse = file_get_contents($verifyUrl);
    $responseData = json_decode($verifyResponse);
    
    if (!$responseData->success) {
        echo json_encode(['status' => 'error', 'message' => 'reCAPTCHA validacija nije uspjela. Molimo pokušajte ponovo.']);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'reCAPTCHA token nije pronađen.']);
    exit;
}

// Validate input
if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'Sva obavezna polja moraju biti popunjena.']);
    exit;
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Unesite ispravnu email adresu.']);
    exit;
}

// Sanitize input
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : '';
$message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

// Prepare email content
$emailContent = "
    <html>
    <head>
        <title>{$subject}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #c8a97e; font-size: 24px; margin-bottom: 20px; }
            .detail { margin-bottom: 10px; }
            .label { font-weight: bold; color: #c8a97e; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>Nova poruka sa kontakt forme</div>
            <div class='detail'><span class='label'>Ime i prezime:</span> {$name}</div>
            <div class='detail'><span class='label'>Email:</span> {$email}</div>
            <div class='detail'><span class='label'>Telefon:</span> " . ($phone ? $phone : 'Nije naveden') . "</div>
            <div class='detail'><span class='label'>Poruka:</span><br>" . nl2br($message) . "</div>
        </div>
    </body>
    </html>
";

// Set email headers
$headers = "From: {$fromEmail}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Send email
if (mail($toEmail, $subject, $emailContent, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Poruka je uspješno poslana! Kontaktirat ćemo vas u najkraćem mogućem roku.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo kasnije.']);
}
?>