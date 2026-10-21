<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private function valasz(array $tartalom, int $statusz = 200): JsonResponse
    {
        return response()->json($tartalom, $statusz, [], JSON_UNESCAPED_UNICODE);
    }

    public function index(): JsonResponse
    {
        $users = User::all();

        return $this->valasz(['adatok' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nev' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'jelszo' => 'required|string|min:6',
            'telefonszam' => 'nullable|string|max:20',
            'lakhely' => 'nullable|string|max:255',
            'jogosultsag' => 'required|in:admin,dolgozo',
        ]);

        $user = User::create([
            'nev' => $request->nev,
            'email' => $request->email,
            'jelszo' => $request->jelszo,
            'telefonszam' => $request->telefonszam,
            'lakhely' => $request->lakhely,
            'jogosultsag' => $request->jogosultsag,
        ]);

        return $this->valasz(['uzenet' => 'Dolgozó sikeresen létrehozva.', 'adatok' => $user], 201);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return $this->valasz(['hiba' => 'A dolgozó nem található.'], 404);
        }

        return $this->valasz(['adatok' => $user]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return $this->valasz(['hiba' => 'A dolgozó nem található.'], 404);
        }

        $request->validate([
            'nev' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'jelszo' => 'nullable|string|min:6',
            'telefonszam' => 'nullable|string|max:20',
            'lakhely' => 'nullable|string|max:255',
            'jogosultsag' => 'sometimes|required|in:admin,dolgozo',
        ]);

        $updateData = $request->except('jelszo');

        if ($request->has('jelszo') && !empty($request->jelszo)) {
            $updateData['jelszo'] = $request->jelszo;
        }

        $user->update($updateData);

        return $this->valasz(['uzenet' => 'Dolgozó sikeresen frissítve.', 'adatok' => $user]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return $this->valasz(['hiba' => 'A dolgozó nem található.'], 404);
        }

        if ($request->user() && $request->user()->id === $user->id) {
            return $this->valasz(['hiba' => 'Saját fiókodat nem törölheted.'], 403);
        }

        $user->delete();

        return $this->valasz(['uzenet' => 'Dolgozó sikeresen törölve.']);
    }
}
