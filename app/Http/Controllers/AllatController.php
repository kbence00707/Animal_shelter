<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AllatController extends Controller
{
    private function mintaAllatok(): array
    {
        return [
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
    }

    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        return $this->valasz(['adatok' => $this->mintaAllatok()]);
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id): JsonResponse
    {
        $azonosito = filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

        if ($azonosito === false) {
            return $this->valasz(['hiba' => 'Az azonosító csak pozitív egész szám lehet.'], 400);
        }

        foreach ($this->mintaAllatok() as $allat) {
            if ($allat['id'] === $azonosito) {
                return $this->valasz(['adatok' => $allat]);
            }
        }

        return $this->valasz(['hiba' => 'Az állat nem található.'], 404);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}