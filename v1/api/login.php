<?php
    include '/home/u908685741/domains/rometimerror.it/public_html/management-alfa/v1/api/db.php'; 
    header('Content-Type: application/json');
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $passwordInserita = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM utente WHERE mail = :email"); 
    $stmt->execute([':email' => $email]);
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $hashPassword = $row['password']; // Primo elemento
        $ruolo = $row['ruolo'];  
        $id_utente = $row['id_utente'];
        
        if ($hashPassword) {
            // Password corretta
            echo json_encode(['success' => true, 'role' => $ruolo, 'id' => $id_utente]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Password errata']);
        }  
    } else {
        echo json_encode(['success' => false, 'message' => 'Utente non presente']);
    }
?>