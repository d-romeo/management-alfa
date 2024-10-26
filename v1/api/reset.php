<?php
    include '/home/u908685741/domains/rometimerror.it/public_html/management-alfa/v1/api/db.php'; 
    include '/home/u908685741/domains/rometimerror.it/public_html/phpmailer.php';
    header('Content-Type: application/json');
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = generaPasswordCasuale(); 

    $stmt = $pdo->prepare("SELECT * FROM utente WHERE mail = :email"); 
    $stmt->execute([':email' => $email]);
  
    if ($stmt->rowCount() > 0) { 
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_utente = $row['id_utente']; 
        $generatedPassword = generaPasswordCasuale();

        $stmt = $pdo->prepare("UPDATE utente SET password = :password WHERE id_utente = :id_utente"); 
        
        if ($stmt->execute([':id_utente' => $id_utente, ':password' => $generatedPassword])){
            if(resetMail($email,$generatedPassword, $id_utente)){
                echo json_encode(['success'=> true]);
            } else {
                echo json_encode(['success'=> false,'message'=> 'Password modificata, messaggio non inviato']);
            }
        } else {
            echo json_encode(['success' => false, 'message'=> 'Update non andata a buon fine']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Utente non presente']);
    }
?>