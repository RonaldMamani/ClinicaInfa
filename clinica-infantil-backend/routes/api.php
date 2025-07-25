<?php

use App\Http\Controllers\Api\EstadoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/estados', [EstadoController::class, 'index']);
Route::get('/estados/{estado}', [EstadoController::class, 'show']);