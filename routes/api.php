<?php

use App\Http\Controllers\AllatController;
use Illuminate\Support\Facades\Route;

Route::get('/allatok', [AllatController::class, 'index']);
Route::get('/allatok/{id}', [AllatController::class, 'show']);