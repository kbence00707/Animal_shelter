<?php
header('Content-Type: application/json; charset=utf-8');

$valasz = [
    'uzenet'  => 'Működik a backend',
    'allapot' => 'ok',
];

echo json_encode($valasz, JSON_UNESCAPED_UNICODE);