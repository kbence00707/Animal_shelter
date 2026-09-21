<?php
header('Content-Type: application/json; charset=utf-8');

$metodus = $_SERVER['REQUEST_METHOD'];

$allatok = [
    [
        'id'               => 1,
        'nev'              => 'Bodri',
        'faj'              => 'kutya',
        'fajta'            => 'keverék',
        'nem'              => 'him',
        'szuletesi_datum'  => '2022-05-10',
        'suly_kg'          => 18.5,
        'magassag_cm'      => 50,
        'bekerules_datuma' => '2026-03-01',
        'chip'             => true,
        'leiras'           => 'Barátságos, szereti a gyerekeket.',
        'allapot'          => 'orokbefogadhato',
    ],
    [
        'id'               => 2,
        'nev'              => 'Cirmi',
        'faj'              => 'macska',
        'fajta'            => 'európai rövidszőrű',
        'nem'              => 'nosteny',
        'szuletesi_datum'  => '2024-08-15',
        'suly_kg'          => 3.8,
        'magassag_cm'      => 25,
        'bekerules_datuma' => '2026-06-20',
        'chip'             => false,
        'leiras'           => 'Bújós, dorombolós cica.',
        'allapot'          => 'orokbefogadhato',
    ],
];

if ($metodus === 'GET') {

    if (isset($_GET['id'])) {
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

        if ($id === false) {
            http_response_code(400);
            echo json_encode(['hiba' => 'Az azonosító csak pozitív egész szám lehet.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        foreach ($allatok as $allat) {
            if ($allat['id'] === $id) {
                echo json_encode(['adatok' => $allat], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        http_response_code(404);
        echo json_encode(['hiba' => 'Az állat nem található.'], JSON_UNESCAPED_UNICODE);

    } else {
        echo json_encode(['adatok' => $allatok], JSON_UNESCAPED_UNICODE);
    }

} else {
    http_response_code(405);
    echo json_encode(['hiba' => 'Ez a metódus itt nem engedélyezett.'], JSON_UNESCAPED_UNICODE);
}