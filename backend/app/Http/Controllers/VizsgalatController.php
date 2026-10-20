<?php

namespace App\Http\Controllers;

use App\Models\Vizsgalat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VizsgalatController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        $vizsgalatok = Vizsgalat::with(['allat', 'orvos'])->get();

        return $this->valasz(['adatok' => $vizsgalatok]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'allat_id' => 'required|exists:allatok,id',
            'orvos_id' => 'required|exists:orvosok,id',
            'orvosi_ido' => 'required|date',
            'betegseg' => 'nullable|string|max:255',
            'oltas' => 'nullable|string|max:255',
            'megjegyzes' => 'nullable|string',
        ]);

        $vizsgalat = Vizsgalat::create($request->all());

        return $this->valasz(['uzenet' => 'Vizsgálat sikeresen létrehozva.', 'adatok' => $vizsgalat], 201);
    }

    public function show(string $id): JsonResponse
    {
        $vizsgalat = Vizsgalat::with(['allat', 'orvos'])->find($id);

        if (!$vizsgalat) {
            return $this->valasz(['hiba' => 'A vizsgálat nem található.'], 404);
        }

        return $this->valasz(['adatok' => $vizsgalat]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $vizsgalat = Vizsgalat::find($id);

        if (!$vizsgalat) {
            return $this->valasz(['hiba' => 'A vizsgálat nem található.'], 404);
        }

        $request->validate([
            'allat_id' => 'sometimes|required|exists:allatok,id',
            'orvos_id' => 'sometimes|required|exists:orvosok,id',
            'orvosi_ido' => 'sometimes|required|date',
            'betegseg' => 'nullable|string|max:255',
            'oltas' => 'nullable|string|max:255',
            'megjegyzes' => 'nullable|string',
        ]);

        $vizsgalat->update($request->all());

        return $this->valasz(['uzenet' => 'Vizsgálat sikeresen frissítve.', 'adatok' => $vizsgalat]);
    }

    public function destroy(string $id): JsonResponse
    {
        $vizsgalat = Vizsgalat::find($id);

        if (!$vizsgalat) {
            return $this->valasz(['hiba' => 'A vizsgálat nem található.'], 404);
        }

        $vizsgalat->delete();

        return $this->valasz(['uzenet' => 'Vizsgálat sikeresen törölve.']);
    }

    public function byAllat(string $allatId): JsonResponse
    {
        $vizsgalatok = Vizsgalat::where('allat_id', $allatId)->with(['allat', 'orvos'])->get();

        return $this->valasz(['adatok' => $vizsgalatok]);
    }
}
