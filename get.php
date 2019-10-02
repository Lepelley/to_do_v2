<?php
    require_once 'config.php';

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    $json_array = array();
    $db = dbConnect();
    $query = $db->query('SELECT id, content, status FROM task');
    while ($data = $query->fetch(PDO::FETCH_ASSOC)) {
        $json_array[] = $data;
    }

    http_response_code(200); // OK

    echo json_encode($json_array);
    
