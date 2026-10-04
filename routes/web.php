<?php

use Illuminate\Support\Facades\Route;

// Egyelőre csak frontendbemutató, valódi bejelentkezés és adatmentés nélkül.
Route::view('/', 'home')->name('home');
Route::view('/login', 'login')->name('login');
Route::view('/admin', 'admin')->name('admin');
Route::view('/worker', 'worker')->name('worker');
