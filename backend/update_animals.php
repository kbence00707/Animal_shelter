<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Allat;

// Frissítjük az állatok adatait
$updates = [
    1 => [
        'nev' => 'Barney',
        'faj' => 'kutya',
        'fajta' => 'Golden Retriever',
        'nem' => 'him',
        'szuletesi_datum' => '2022-05-09',
        'suly_kg' => 32.00,
        'leiras' => 'Barátságos, játékos kutyus, imádja a gyerekeket.',
        'kep' => 'dog.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-02-28',
        'chip' => true,
    ],
    2 => [
        'nev' => 'Cirmi',
        'faj' => 'macska',
        'fajta' => 'Európai rövidszőrű',
        'nem' => 'nosteny',
        'szuletesi_datum' => '2024-08-14',
        'suly_kg' => 3.80,
        'leiras' => 'Bújós, dorombolós cica, szereti az ölelést.',
        'kep' => 'cat.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-06-19',
        'chip' => false,
    ],
    3 => [
        'nev' => 'Rex',
        'faj' => 'kutya',
        'fajta' => 'Keverék',
        'nem' => 'him',
        'szuletesi_datum' => '2021-03-19',
        'suly_kg' => 25.00,
        'leiras' => 'Aktív, sok mozgásra van szüksége, hűséges társ.',
        'kep' => 'kutya.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-07-09',
        'chip' => true,
    ],
    4 => [
        'nev' => 'Cica',
        'faj' => 'macska',
        'fajta' => 'Maine Coon',
        'nem' => 'nosteny',
        'szuletesi_datum' => '2023-11-04',
        'suly_kg' => 6.50,
        'leiras' => 'Nagytestű, nyugodt, barátságos cica.',
        'kep' => 'cat2.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-09-14',
        'chip' => true,
    ],
    5 => [
        'nev' => 'Bözsi',
        'faj' => 'kutya',
        'fajta' => 'Boxer',
        'nem' => 'nosteny',
        'szuletesi_datum' => '2024-02-09',
        'suly_kg' => 28.00,
        'leiras' => 'Energikus, játékos kutyus, remek óvó.',
        'kep' => 'dog2.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-07-31',
        'chip' => true,
    ],
    6 => [
        'nev' => 'Morzsa',
        'faj' => 'macska',
        'fajta' => 'Perzsa',
        'nem' => 'him',
        'szuletesi_datum' => '2023-06-19',
        'suly_kg' => 5.50,
        'leiras' => 'Nyugodt, hosszú szőrű, ápolt cica.',
        'kep' => 'cat.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-05-14',
        'chip' => true,
    ],
    7 => [
        'nev' => 'Süni',
        'faj' => 'kisállat',
        'fajta' => 'Tengerimalac',
        'nem' => 'him',
        'szuletesi_datum' => '2023-01-15',
        'suly_kg' => 1.20,
        'leiras' => 'Kicsi, kedves tengerimalac, szereti a répát.',
        'kep' => 'tengeri_malac.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-04-09',
        'chip' => false,
    ],
    8 => [
        'nev' => 'Sziam',
        'faj' => 'macska',
        'fajta' => 'Sziámi',
        'nem' => 'nosteny',
        'szuletesi_datum' => '2023-03-14',
        'suly_kg' => 3.50,
        'leiras' => 'Élénk, beszédes cica, jellegzetes kék szemei vannak.',
        'kep' => 'cat2.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-07-24',
        'chip' => true,
    ],
    9 => [
        'nev' => 'Buksi',
        'faj' => 'kutya',
        'fajta' => 'Border Collie',
        'nem' => 'him',
        'szuletesi_datum' => '2021-09-04',
        'suly_kg' => 22.00,
        'leiras' => 'Nagyon okos, munkáshoz született kutya.',
        'kep' => 'kutya.jpg',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-02-19',
        'chip' => true,
    ],
    10 => [
        'nev' => 'Pamacs',
        'faj' => 'kisállat',
        'fajta' => 'Nyúl',
        'nem' => 'him',
        'szuletesi_datum' => '2024-01-09',
        'suly_kg' => 2.50,
        'leiras' => 'Csendes, puha nyuszi, szereti a sárgarépát.',
        'kep' => 'rabbit.png',
        'allapot' => 'orokbefogadhato',
        'bekerules_datuma' => '2026-08-31',
        'chip' => false,
    ],
];

foreach ($updates as $id => $data) {
    $allat = Allat::find($id);
    if ($allat) {
        $allat->update($data);
        echo "✓ Állat #$id ({$data['nev']}) frissítve.\n";
    } else {
        echo "✗ Állat #$id nem található.\n";
    }
}

echo "\nÖsszesen " . count($updates) . " állat frissítve.\n";
