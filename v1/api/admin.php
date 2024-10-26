<?php
include '/home/u908685741/domains/rometimerror.it/public_html/phpmailer.php';
include '/home/u908685741/domains/rometimerror.it/public_html/management-alfa/v1/api/db.php'; 
header('Content-Type: application/json');

try {
    // Ottieni il valore dell'azione dalla query string
    $azione = $_GET['azione'] ?? null;

    switch ($azione) {
        // Recupera tutti gli utenti
        case 'getUtenti':
            $stmt = $pdo->query("
                SELECT 
                    c.id_collaboratore,
                    c.id_utente, 
                    c.nome,
                    c.cognome,
                    c.telefono,
                    c.compenso,
                    c.doposcuola,
                    c.stato_pagamento,
                    u.mail,
                    GROUP_CONCAT(m.nome_materia ORDER BY m.nome_materia SEPARATOR ', ') AS materie
                FROM 
                    collaboratore c
                LEFT JOIN 
                    materia_collab mc ON c.id_collaboratore = mc.id_collaboratore
                LEFT JOIN 
                    materia_rip m ON mc.id_materia = m.id_materia
                LEFT JOIN 
                    utente u ON c.id_utente = u.id_utente
                GROUP BY 
                    c.id_collaboratore, c.nome, c.cognome, c.telefono, c.compenso, c.doposcuola, c.stato_pagamento, u.mail;
                ");
            $collaboratori = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($collaboratori);
        break;

        case 'addUser':
            $input = json_decode(file_get_contents('php://input'), true);
            error_log(print_r($input, true));
        
            $mail = isset($input['mail']) ? strtolower(trim($input['mail'])) : '';
            $cognome = isset($input['cognome']) ? strtolower(trim($input['cognome'])) : '';
            $nome = isset($input['nome']) ? strtolower(trim($input['nome'])) : '';
            $telefono = $input['telefono'] ?? '';
            $compenso = $input['compenso'] ?? '';
            $pagato = isset($input['stato_pagamento']) ? 1 : 0;
            $password = "alfa2024"; //password default
            $doposcuola = isset($input['doposcuola']) ? 1 : 0;
            $ruolo = isset($input['ruolo']) ? 1 : 0;
        
            // Verifica esistenza mail nel database
            $stmt = $pdo->prepare("SELECT id_utente, mail FROM utente WHERE mail = :mail");
            $stmt->execute([':mail' => $mail]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'Utente già registrato.']);
                exit; 
            }
        
            // Inserimento utente
            $stmt = $pdo->prepare("INSERT INTO utente (mail, password, ruolo) VALUES (:mail, :password, :ruolo)");
            if ($stmt->execute([
                ':mail' => $mail,
                ':password' => password_hash($password, PASSWORD_DEFAULT),
                ':ruolo' => $ruolo
            ])){
                $id_utente = $pdo->lastInsertId(); // Ottieni l'ID dell'utente appena inserito
        
                // Inserimento collaboratore
                $stmt = $pdo->prepare("INSERT INTO collaboratore (id_utente, nome, cognome, telefono, compenso, stato_pagamento, doposcuola) 
                                        VALUES (:id_utente, :nome, :cognome, :telefono, :compenso, :stato_pagamento, :doposcuola)");
        
                if ($stmt->execute([
                    ':id_utente' => $id_utente,
                    ':nome' => $nome,
                    ':cognome' => $cognome,
                    ':telefono' => $telefono,
                    ':compenso' => $compenso,
                    ':stato_pagamento' => $pagato,
                    ':doposcuola' => $doposcuola
                ])) {
                    if(accessMail($nome,$mail,$password)){
                        echo json_encode(['success'=> true]);
                    } else {
                        echo json_encode(['success'=> true,'message'=> 'Utente inserito, messaggio non inviato']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Errore durante la registrazione.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Errore durante l\'inserimento nel database.']);
            }
            break;
              
        case 'deleteUser':
            $input = json_decode(file_get_contents('php://input'), true);
            error_log(print_r($input, true)); // Stampa il contenuto per il debug
        
            $id_utente = $input['id_utente'] ?? '';
            $id_collaboratore = $input['id_collaboratore'] ?? ''; 
        
            $response = ['success' => false, 'message' => 'Errore sconosciuto'];
        
            // Verifica esistenza del collaboratore nella tabella materia_collab
            $stmt = $pdo->prepare("SELECT * FROM materia_collab WHERE id_collaboratore = :id_collaboratore");
            $stmt->execute([':id_collaboratore' => $id_collaboratore]);
            
            if ($stmt->rowCount() > 0) {
                // Prima cancellazione: materia_collab
                $stmt = $pdo->prepare("DELETE FROM materia_collab WHERE id_collaboratore = :id_collaboratore");
                $result = $stmt->execute([':id_collaboratore' => $id_collaboratore]);
            }
                    // Seconda cancellazione: collaboratore
                    $stmt = $pdo->prepare("DELETE FROM collaboratore WHERE id_collaboratore = :id_collaboratore");
                    if ($stmt->execute([':id_collaboratore' => $id_collaboratore])) {
                        
                        // Terza cancellazione: utente
                        $stmt = $pdo->prepare("DELETE FROM utente WHERE id_utente = :id_utente");
                        if ($stmt->execute([':id_utente' => $id_utente])) {
                            $response = ['success' => true, 'message' => 'Utente eliminato con successo'];
                        } else {
                            $response['message'] = 'Errore durante la rimozione dal database dell\'utente';
                        }
                    } else {
                        $response['message'] = 'Errore durante la rimozione dal database del collaboratore';
                    }
                // Invia la risposta finale
                echo json_encode($response);
            break;
                
        case 'toggleDoposcuola': 
            // Leggi i dati dal body della richiesta
            $input = json_decode(file_get_contents('php://input'), true);
        
            // Estrai id_collaboratore e doposcuola dall'input JSON
            $id_collaboratore = $input['id_collaboratore'] ?? null; 
            
            $doposcuola = isset($input['doposcuola']) ? (int)$input['doposcuola'] : 0; 
            $doposcuola = !$doposcuola; 

            $stmt = $pdo->prepare("UPDATE collaboratore
                                        SET doposcuola = :doposcuola 
                                        WHERE id_collaboratore = :id_collaboratore");
                // Esegui la query
            $result = $stmt->execute([
                ':id_collaboratore' => $id_collaboratore, 
                ':doposcuola' => $doposcuola
            ]);
    
            // Controlla se l'esecuzione ha avuto successo
            if ($result) {
                $response = ['success' => true, 'message' => 'Stato doposcuola aggiornato con successo'];
            } else {
                $response['message'] = 'Errore durante l\'aggiornamento del database';
            }
    
            // Invia la risposta finale
            echo json_encode($response); 
        break;
                
        default: 
            $response['message'] = 'Errore, azione non valida.';
            echo json_encode($response);
        break; 
    }
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
