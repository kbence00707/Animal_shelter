<?php

namespace App\Http\Controllers;

use App\Models\Allat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AllatController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Allat::query();

        if ($request->has('status')) {
            $query->where('allapot', $request->status);
        }

        if ($request->has('faj')) {
            $query->where('faj', $request->faj);
        }

        $allatok = $query->get();

        return $this->valasz(['adatok' => $allatok]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nev' => 'required|string|max:255',
            'faj' => 'required|string|max:100',
            'fajta' => 'nullable|string|max:255',
            'nem' => 'required|in:him,nosteny',
            'szuletesi_datum' => 'nullable|date',
            'suly_kg' => 'nullable|numeric',
            'magassag_cm' => 'nullable|integer',
            'leiras' => 'nullable|string',
            'kep' => 'nullable|string',
            'allapot' => 'required|in:orokbefogadhato,kezeles_alatt,orokbefogadva',
            'bekerules_datuma' => 'nullable|date',
            'chip' => 'nullable|boolean',
        ]);

        $allat = Allat::create($request->all());

        return $this->valasz(['uzenet' => 'Állat sikeresen létrehozva.', 'adatok' => $allat], 201);
    }

    public function show(string $id): JsonResponse
    {
        $allat = Allat::find($id);

        if (!$allat) {
            return $this->valasz(['hiba' => 'Az állat nem található.'], 404);
        }

        return $this->valasz(['adatok' => $allat]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $allat = Allat::find($id);

        if (!$allat) {
            return $this->valasz(['hiba' => 'Az állat nem található.'], 404);
        }

        $request->validate([
            'nev' => 'sometimes|required|string|max:255',
            'faj' => 'sometimes|required|string|max:100',
            'fajta' => 'nullable|string|max:255',
            'nem' => 'sometimes|required|in:him,nosteny',
            'szuletesi_datum' => 'nullable|date',
            'suly_kg' => 'nullable|numeric',
            'magassag_cm' => 'nullable|integer',
            'leiras' => 'nullable|string',
            'kep' => 'nullable|string',
            'allapot' => 'sometimes|required|in:orokbefogadhato,kezeles_alatt,orokbefogadva',
            'bekerules_datuma' => 'nullable|date',
            'chip' => 'nullable|boolean',
        ]);

        $allat->update($request->all());

        return $this->valasz(['uzenet' => 'Állat sikeresen frissítve.', 'adatok' => $allat]);
    }

    public function destroy(string $id): JsonResponse
    {
        $allat = Allat::find($id);

        if (!$allat) {
            return $this->valasz(['hiba' => 'Az állat nem található.'], 404);
        }

        $allat->delete();

        return $this->valasz(['uzenet' => 'Állat sikeresen törölve.']);
    }

    public function uploadKep(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'kep' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $allat = Allat::find($id);

        if (!$allat) {
            return $this->valasz(['hiba' => 'Az állat nem található.'], 404);
        }

        if ($request->hasFile('kep')) {
            $file = $request->file('kep');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('pictures'), $filename);
            $allat->kep = $filename;
            $allat->save();
        }

        return $this->valasz(['uzenet' => 'Kép sikeresen feltöltve.', 'adatok' => $allat]);
    }
}