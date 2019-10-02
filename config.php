<?php

    function dbConnect()
    {
        $dns = 'mysql';
        $host = 'localhost';
        $db = 'portfolio';
        $user = 'root';
        $password = '';

        $db = new \PDO($dns . ':host=' . $host . ';dbname=' . $db . ';charset=utf8', $user, $password);
        $db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
        return $db;
    }