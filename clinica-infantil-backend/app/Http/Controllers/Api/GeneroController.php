<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genero;
use Illuminate\Http\Request;

class GeneroController extends Controller
{
    public function index()
    {
        $generos = Genero::orderBy('id', 'ASC')->get();
        return response()->json([
            'status' => true,
            'generos' => $generos,
        ], 200);
    }

    public function show(Genero $genero)
    {
        return response()->json([
            'status' => true,
            'genero' => $genero
        ], 200);
    }
}
