<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

// Teszt felhasználók létrehozása
$users = [
    [
        'nev' => 'Adminisztrátor',
        'email' => 'admin@menhely.hu',
        'jelszo' => 'admin123',
        'telefonszam' => '+36 30 123 4567',
        'lakhely' => 'Mihályi',
        'jogosultsag' => 'admin',
    ],
    [
        'nev' => 'Kovács János',
        'email' => 'janos@menhely.hu',
        'jelszo' => 'dolgozo123',
        'telefonszam' => '+36 30 234 5678',
        'lakhely' => 'Mihályi',
        'jogosultsag' => 'dolgozo',
    ],
    [
        'nev' => 'Nagy Éva',
        'email' => 'eva@menhely.hu',
        'jelszo' => 'dolgozo123',
        'telefonszam' => '+36 30 345 6789',
        'lakhely' => 'Mihályi',
        'jogosultsag' => 'dolgozo',
    ],
];

foreach ($users as $userData) {
    $user = User::create($userData);
    echo "✓ Felhasználó létrehozva: {$user->nev} ({$user->email}) - {$user->jogosultsag}\n";
}

echo "\nÖsszesen " . count($users) . " felhasználó létrehozva.\n";
echo "\nBejelentkezési adatok:\n";
echo "Admin: admin@menhely.hu / admin123\n";
echo "Dolgozó 1: janos@menhely.hu / dolgozo123\n";
echo "Dolgozó 2: eva@menhely.hu / dolgozo123\n";
