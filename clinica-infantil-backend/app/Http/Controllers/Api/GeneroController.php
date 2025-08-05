<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genero;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

    public function getGenero(): JsonResponse
    {
        try {
            $generos = Genero::orderBy('genero')->get();

            return response()->json([
                'status' => true,
                'message' => 'Gêneros listados com sucesso.',
                'generos' => $generos,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar gêneros: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os gêneros.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Genero $genero)
    {
        return response()->json([
            'status' => true,
            'genero' => $genero
        ], 200);
    }
}
