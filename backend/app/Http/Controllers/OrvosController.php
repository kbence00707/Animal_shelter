<?php

namespace App\Http\Controllers;

use App\Models\Orvos;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrvosController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        $orvosok = Orvos::all();

        return $this->valasz(['adatok' => $orvosok]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nev' => 'required|string|max:255',
        ]);

        $orvos = Orvos::create($request->all());

        return $this->valasz(['uzenet' => 'Orvos sikeresen létrehozva.', 'adatok' => $orvos], 201);
    }

    public function show(string $id): JsonResponse
    {
        $orvos = Orvos::with('vizsgalatok')->find($id);

        if (!$orvos) {
            return $this->valasz(['hiba' => 'Az orvos nem található.'], 404);
        }

        return $this->valasz(['adatok' => $orvos]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $orvos = Orvos::find($id);

        if (!$orvos) {
            return $this->valasz(['hiba' => 'Az orvos nem található.'], 404);
        }

        $request->validate([
            'nev' => 'sometimes|required|string|max:255',
        ]);

        $orvos->update($request->all());

        return $this->valasz(['uzenet' => 'Orvos sikeresen frissítve.', 'adatok' => $orvos]);
    }

    public function destroy(string $id): JsonResponse
    {
        $orvos = Orvos::find($id);

        if (!$orvos) {
            return $this->valasz(['hiba' => 'Az orvos nem található.'], 404);
        }

        $orvos->delete();

        return $this->valasz(['uzenet' => 'Orvos sikeresen törölve.']);
    }
}
