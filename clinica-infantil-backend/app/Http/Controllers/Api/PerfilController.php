<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerfilRequest;
use App\Models\Perfil;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PerfilController extends Controller
{
    /**
     * Lista todos os perfis do banco de dados.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Busca todos os perfis, ordenando-os pelo nome
            $perfis = Perfil::orderBy('nome_perfil', 'ASC')->get();

            // Retorna a lista de perfis em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de perfis obtida com sucesso.',
                'perfis' => $perfis,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar perfis: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os perfis. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Exibe um perfil específico pelo seu ID.
     *
     * @param Perfil $perfil O perfil a ser exibido (via Route Model Binding).
     * @return JsonResponse
     */
    public function show(Perfil $perfil): JsonResponse
    {
        try {
            // Retorna os detalhes do perfil em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Perfil obtido com sucesso.',
                'perfil' => $perfil,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao buscar perfil por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o perfil. Verifique os logs do servidor.',
            ], 500);
        }
    }
}
