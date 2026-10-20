<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nev' => 'Adminisztrátor',
            'email' => 'admin@mihalyimenhely.hu',
            'jelszo' => 'password',
            'telefonszam' => '+36 30 123 4567',
            'lakhely' => '9342 Mihályi, Korona utca 1.',
            'jogosultsag' => 'admin',
        ]);

        User::create([
            'nev' => 'Kovács Anna',
            'email' => 'anna@mihalyimenhely.hu',
            'jelszo' => 'password',
            'telefonszam' => '+36 30 999 8888',
            'lakhely' => '9342 Mihályi, Fő utca 5.',
            'jogosultsag' => 'dolgozo',
        ]);
    }
}
