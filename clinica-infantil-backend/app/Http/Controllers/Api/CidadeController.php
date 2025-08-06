<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cidade;
use App\Models\Estado;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CidadeController extends Controller
{
     /**
     * Lista todas as cidades.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() : JsonResponse
    {
        try {
            // Busca todas as cidades, ordenando-as pelo ID
            // Inclui o relacionamento com o Estado para que os dados do estado sejam retornados
            $cidades = Cidade::with('estado')->orderBy('id', 'ASC')->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de cidades obtida com sucesso.',
                'cidades' => $cidades,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar cidades: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as cidades. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lista cidades por um determinado ID de estado.
     *
     * @param int $estadoId O ID do estado para filtrar as cidades.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCidadesByEstado(int $estadoId) : JsonResponse
    {
        try {
            // Verifica se o estado existe antes de tentar buscar as cidades
            $estado = Estado::find($estadoId);
            if (!$estado) {
                return response()->json([
                    'status' => false,
                    'message' => 'Estado não encontrado.',
                ], 404);
            }

            // Busca as cidades que pertencem ao estado especificado, ordenando pelo nome
            $cidades = Cidade::where('id_estado', $estadoId)
                             ->orderBy('nome_cidade', 'ASC')
                             ->get();

            return response()->json([
                'status' => true,
                'message' => "Cidades do estado '{$estado->nome_estado}' obtidas com sucesso.",
                'cidades' => $cidades,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao buscar cidades por estado: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as cidades por estado. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}