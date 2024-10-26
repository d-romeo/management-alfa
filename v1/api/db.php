<?php
    $host = 'srv1649.hstgr.io'; 
    $db = 'u908685741_Alfa';
    $user = 'u908685741_admin';
    $pass = 'Danieleromeo01!';

    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>