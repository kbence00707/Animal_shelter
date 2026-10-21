<?php

namespace App\Http\Controllers;

use App\Models\Allat;
use App\Models\Foglalas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoglalasController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        $foglalasok = Foglalas::with('allat')->datumSzerint()->get();

        return $this->valasz(['adatok' => $foglalasok]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'latogato_nev' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'telefonszam' => 'required|string|max:20',
            'allat_id' => 'required|exists:allatok,id',
            'datum' => 'required|date|after_or_equal:today',
            'idopont' => 'required|date_format:H:i',
        ], [
            'latogato_nev.required' => 'A név megadása kötelező.',
            'email.required' => 'Az e-mail cím megadása kötelező.',
            'email.email' => 'Érvénytelen e-mail cím formátum.',
            'telefonszam.required' => 'A telefonszám megadása kötelező.',
            'telefonszam.max' => 'A telefonszám túl hosszú.',
            'allat_id.required' => 'Válassz állatot!',
            'allat_id.exists' => 'A kiválasztott állat nem létezik.',
            'datum.required' => 'A dátum megadása kötelező.',
            'datum.date' => 'Érvénytelen dátum.',
            'datum.after_or_equal' => 'A foglalás dátuma nem lehet múltbéli.',
            'idopont.required' => 'Az időpont megadása kötelező.',
            'idopont.date_format' => 'Érvénytelen időpont formátum.',
        ]);

        $allat = Allat::find($request->allat_id);
        if ($allat->allapot !== 'orokbefogadhato') {
            return $this->valasz(['hiba' => 'A kiválasztott állat jelenleg nem örökbefogadható.'], 422);
        }

        $foglalas = Foglalas::create($request->all());

        return $this->valasz(['uzenet' => 'Foglalás sikeresen létrehozva.', 'adatok' => $foglalas], 201);
    }

    public function show(string $id): JsonResponse
    {
        $foglalas = Foglalas::with('allat')->find($id);

        if (!$foglalas) {
            return $this->valasz(['hiba' => 'A foglalás nem található.'], 404);
        }

        return $this->valasz(['adatok' => $foglalas]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $foglalas = Foglalas::find($id);

        if (!$foglalas) {
            return $this->valasz(['hiba' => 'A foglalás nem található.'], 404);
        }

        $request->validate([
            'latogato_nev' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255',
            'telefonszam' => 'sometimes|required|string|max:20',
            'allat_id' => 'sometimes|required|exists:allatok,id',
            'datum' => 'sometimes|required|date|after_or_equal:today',
            'idopont' => 'sometimes|required|date_format:H:i',
            'statusz' => 'sometimes|required|in:fuggoben,elfogadva,elutasitva',
        ]);

        $foglalas->update($request->all());

        return $this->valasz(['uzenet' => 'Foglalás sikeresen frissítve.', 'adatok' => $foglalas]);
    }

    public function destroy(string $id): JsonResponse
    {
        $foglalas = Foglalas::find($id);

        if (!$foglalas) {
            return $this->valasz(['hiba' => 'A foglalás nem található.'], 404);
        }

        $foglalas->delete();

        return $this->valasz(['uzenet' => 'Foglalás sikeresen törölve.']);
    }
}
