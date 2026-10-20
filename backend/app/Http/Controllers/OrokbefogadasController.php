<?php

namespace App\Http\Controllers;

use App\Models\Orokbefogadas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrokbefogadasController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        $orokbefogadasok = Orokbefogadas::with('allat')->get();

        return $this->valasz(['adatok' => $orokbefogadasok]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'allat_id' => 'required|exists:allatok,id',
            'latogato_nev' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'telefonszam' => 'required|string|max:20',
            'fogadas_datum' => 'required|date|after_or_equal:today',
            'megjegyzes' => 'nullable|string',
        ], [
            'allat_id.required' => 'Válassz állatot!',
            'allat_id.exists' => 'A kiválasztott állat nem létezik.',
            'latogato_nev.required' => 'A név megadása kötelező.',
            'email.required' => 'Az e-mail cím megadása kötelező.',
            'email.email' => 'Érvénytelen e-mail cím formátum.',
            'telefonszam.required' => 'A telefonszám megadása kötelező.',
            'fogadas_datum.required' => 'A dátum megadása kötelező.',
            'fogadas_datum.date' => 'Érvénytelen dátum.',
            'fogadas_datum.after_or_equal' => 'Az örökbefogadás dátuma nem lehet múltbéli.',
        ]);

        $orokbefogadas = Orokbefogadas::create($request->all());

        return $this->valasz(['uzenet' => 'Örökbefogás sikeresen létrehozva.', 'adatok' => $orokbefogadas], 201);
    }

    public function show(string $id): JsonResponse
    {
        $orokbefogadas = Orokbefogadas::with('allat')->find($id);

        if (!$orokbefogadas) {
            return $this->valasz(['hiba' => 'Az örökbefogadás nem található.'], 404);
        }

        return $this->valasz(['adatok' => $orokbefogadas]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $orokbefogadas = Orokbefogadas::find($id);

        if (!$orokbefogadas) {
            return $this->valasz(['hiba' => 'Az örökbefogadás nem található.'], 404);
        }

        $request->validate([
            'statusz' => 'sometimes|required|in:fuggoben,elfogadva,elutasitva',
            'megjegyzes' => 'nullable|string',
        ]);

        $orokbefogadas->update($request->all());

        return $this->valasz(['uzenet' => 'Örökbefogás sikeresen frissítve.', 'adatok' => $orokbefogadas]);
    }

    public function destroy(string $id): JsonResponse
    {
        $orokbefogadas = Orokbefogadas::find($id);

        if (!$orokbefogadas) {
            return $this->valasz(['hiba' => 'Az örökbefogadás nem található.'], 404);
        }

        $orokbefogadas->delete();

        return $this->valasz(['uzenet' => 'Örökbefogás sikeresen törölve.']);
    }

    public function byAllat(string $allatId): JsonResponse
    {
        $orokbefogadasok = Orokbefogadas::where('allat_id', $allatId)->with('allat')->get();

        return $this->valasz(['adatok' => $orokbefogadasok]);
    }
}
