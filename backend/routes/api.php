<?php

use App\Http\Controllers\AllatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoglalasController;
use App\Http\Controllers\OrokbefogadasController;
use App\Http\Controllers\OrvosController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VizsgalatController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/allatok', [AllatController::class, 'index']);
// A literális route-ot a paraméteres elé kell tenni, különben az /allatok/{id} elnyeli.
Route::get('/allatok/all', [AllatController::class, 'index'])->middleware('auth:sanctum');
Route::get('/allatok/{id}', [AllatController::class, 'show']);

Route::post('/foglalasok', [FoglalasController::class, 'store']);
Route::post('/orokbefogadasok', [OrokbefogadasController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Lekérdezések - minden bejelentkezett dolgozó láthatja
    Route::get('/foglalasok', [FoglalasController::class, 'index']);
    Route::get('/foglalasok/{id}', [FoglalasController::class, 'show']);

    Route::get('/orokbefogadasok', [OrokbefogadasController::class, 'index']);
    Route::get('/orokbefogadasok/allat/{allatId}', [OrokbefogadasController::class, 'byAllat']);
    Route::get('/orokbefogadasok/{id}', [OrokbefogadasController::class, 'show']);

    Route::get('/vizsgalatok', [VizsgalatController::class, 'index']);
    Route::get('/vizsgalatok/allat/{allatId}', [VizsgalatController::class, 'byAllat']);
    Route::get('/vizsgalatok/{id}', [VizsgalatController::class, 'show']);

    Route::get('/orvosok', [OrvosController::class, 'index']);
    Route::get('/orvosok/{id}', [OrvosController::class, 'show']);

    // Módosítások és törlések - csak admin
    Route::middleware('admin')->group(function () {
        Route::put('/foglalasok/{id}', [FoglalasController::class, 'update']);
        Route::delete('/foglalasok/{id}', [FoglalasController::class, 'destroy']);

        Route::put('/orokbefogadasok/{id}', [OrokbefogadasController::class, 'update']);
        Route::delete('/orokbefogadasok/{id}', [OrokbefogadasController::class, 'destroy']);

        Route::post('/allatok', [AllatController::class, 'store']);
        Route::put('/allatok/{id}', [AllatController::class, 'update']);
        Route::post('/allatok/{id}/kep', [AllatController::class, 'uploadKep']);
        Route::delete('/allatok/{id}', [AllatController::class, 'destroy']);

        Route::post('/vizsgalatok', [VizsgalatController::class, 'store']);
        Route::put('/vizsgalatok/{id}', [VizsgalatController::class, 'update']);
        Route::delete('/vizsgalatok/{id}', [VizsgalatController::class, 'destroy']);

        Route::post('/orvosok', [OrvosController::class, 'store']);
        Route::put('/orvosok/{id}', [OrvosController::class, 'update']);
        Route::delete('/orvosok/{id}', [OrvosController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
