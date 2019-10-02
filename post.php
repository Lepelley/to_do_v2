<?php

    require 'config.php';
    $db = dbConnect();

    // Takes raw data from the request
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $data = json_decode($json);

    if ($data->status == 0 && $data->id > 0) { // Delete task
        $query = $db->prepare('DELETE FROM task WHERE id = :id OR status = :status');
        $query->bindParam(':id', $data->id, PDO::PARAM_INT);
        $query->bindParam(':status', $data->status, PDO::PARAM_INT);
        $query->execute();
        http_response_code(200); // OK
    }
    elseif ($data->content != '' && $data->id > 0) { // Update task
        $query = $db->prepare('UPDATE task SET content = :content, status = :status WHERE id = :id');
        $query->bindParam(':content', htmlspecialchars($data->content));
        $query->bindParam(':status', $data->status, PDO::PARAM_INT);
        $query->bindParam(':id', $data->id, PDO::PARAM_INT);
        $query->execute();
        http_response_code(200); // OK
    }
    elseif ($data->content != '' && !isset($data->id)) { // Add task
        $query = $db->prepare('INSERT INTO task (content, status) VALUES (:content, :status)');
        $query->bindParam(':content', htmlspecialchars($data->content));
        $query->bindParam(':status', $data->status);
        $query->execute();
        echo json_encode($db->lastInsertId());
        http_response_code(201); // Create
    }
    else {
        http_response_code(503); // Service unavailable
        echo '<h1>Nothing to see here !</h1>';
    }