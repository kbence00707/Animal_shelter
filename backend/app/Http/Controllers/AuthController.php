<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'jelszo' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->jelszo, $user->jelszo)) {
            throw ValidationException::withMessages([
                'email' => ['A megadott hitelesítési adatok helytelenek.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nev' => $user->nev,
                'email' => $user->email,
                'jogosultsag' => $user->jogosultsag,
            ],
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['uzenet' => 'Sikeres kijelentkezés.'], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'nev' => $request->user()->nev,
                'email' => $request->user()->email,
                'jogosultsag' => $request->user()->jogosultsag,
            ],
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}
