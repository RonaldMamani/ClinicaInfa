<?php

use App\Http\Controllers\Api\CidadeController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EstadoController;
use App\Http\Controllers\Api\GeneroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/estados', [EstadoController::class, 'index']);
Route::get('/estados/{estado}', [EstadoController::class, 'show']);

Route::get('/cidades', [CidadeController::class, 'index']);
Route::get('/cidades/{cidade}', [CidadeController::class, 'show']);

Route::get('/generos', [GeneroController::class, 'index']);
Route::get('/generos/{genero}', [GeneroController::class, 'show']);

Route::get('/clientes', [ClienteController::class, 'index']);
Route::get('/clientes/{cliente}', [ClienteController::class, 'show']);
Route::post('/clientes', [ClienteController::class, 'store']);
Route::put('/clientes/{id}', [ClienteController::class, 'update']);
Route::patch('/clientes/{id}', [ClienteController::class, 'update']);