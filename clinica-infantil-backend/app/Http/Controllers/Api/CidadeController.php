<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cidade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CidadeController extends Controller
{
    public function index() {
        $cidades = Cidade::orderBy('id', 'ASC')->get();

            return response()->json([
                'status' => true,
                'estados' => $cidades,
        ], 200);
    }

    public function show(Cidade $cidade) : JsonResponse {
        return response()->json([
            'status' => true,
            'cidade' => $cidade
        ], 200);
    }
}
