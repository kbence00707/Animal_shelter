<?php

namespace Database\Seeders;

use App\Models\Allat;
use Illuminate\Database\Seeder;

class AllatSeeder extends Seeder
{
    public function run(): void
    {
        Allat::create([
            'nev' => 'Bodri',
            'faj' => 'kutya',
            'fajta' => 'keverék',
            'nem' => 'him',
            'szuletesi_datum' => '2022-05-10',
            'suly_kg' => 18.5,
            'leiras' => 'Barátságos, szereti a gyerekeket.',
            'kep' => 'dog.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-03-01',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Cirmi',
            'faj' => 'macska',
            'fajta' => 'európai rövidszőrű',
            'nem' => 'nosteny',
            'szuletesi_datum' => '2024-08-15',
            'suly_kg' => 3.8,
            'leiras' => 'Bújós, dorombolós cica.',
            'kep' => 'cat.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-06-20',
            'chip' => false,
        ]);

        Allat::create([
            'nev' => 'Rex',
            'faj' => 'kutya',
            'fajta' => 'német juhász',
            'nem' => 'him',
            'szuletesi_datum' => '2021-03-20',
            'suly_kg' => 35.0,
            'leiras' => 'Aktív, sok mozgásra van szüksége.',
            'kep' => 'dog2.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-07-10',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Cica',
            'faj' => 'macska',
            'fajta' => 'perzsa',
            'nem' => 'nosteny',
            'szuletesi_datum' => '2023-11-05',
            'suly_kg' => 4.2,
            'leiras' => 'Nyugodt, szereti a pihenést.',
            'kep' => 'cat2.jpg',
            'allapot' => 'kezeles_alatt',
            'bekerules_datuma' => '2026-09-15',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Nyuszi',
            'faj' => 'kutya',
            'fajta' => 'tacskó',
            'nem' => 'nosteny',
            'szuletesi_datum' => '2024-02-10',
            'suly_kg' => 5.5,
            'leiras' => 'Aranyos, csendes kutyus.',
            'kep' => 'dog3.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-08-01',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Morzsa',
            'faj' => 'macska',
            'fajta' => 'maine coon',
            'nem' => 'him',
            'szuletesi_datum' => '2023-06-20',
            'suly_kg' => 7.5,
            'leiras' => 'Nagytestű, barátságos cica.',
            'kep' => 'cat3.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-05-15',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Bubi',
            'faj' => 'kutya',
            'fajta' => 'golden retriever',
            'nem' => 'him',
            'szuletesi_datum' => '2022-11-30',
            'suly_kg' => 32.0,
            'leiras' => 'Játékos, nagyon kedves kutyus.',
            'kep' => 'dog4.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-04-10',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Sziam',
            'faj' => 'macska',
            'fajta' => 'sziámi',
            'nem' => 'nosteny',
            'szuletesi_datum' => '2023-03-15',
            'suly_kg' => 3.5,
            'leiras' => 'Élénk, beszédes cica.',
            'kep' => 'cat4.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-07-25',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Buksi',
            'faj' => 'kutya',
            'fajta' => 'boxer',
            'nem' => 'him',
            'szuletesi_datum' => '2021-09-05',
            'suly_kg' => 28.0,
            'leiras' => 'Energikus, jó őrzőkutya.',
            'kep' => 'dog5.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-02-20',
            'chip' => true,
        ]);

        Allat::create([
            'nev' => 'Cirmos',
            'faj' => 'macska',
            'fajta' => 'brit rövidszőrű',
            'nem' => 'him',
            'szuletesi_datum' => '2024-01-10',
            'suly_kg' => 5.0,
            'leiras' => 'Nyugodt, könnyen kezelhető cica.',
            'kep' => 'cat5.jpg',
            'allapot' => 'orokbefogadhato',
            'bekerules_datuma' => '2026-09-01',
            'chip' => false,
        ]);
    }
}
