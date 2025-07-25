<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EstadoController extends Controller
{
    public function index() {
        try {
            DB::connection()->getPdo();
            if(DB::connection()->getDatabaseName()){
                Log::info('Conexão com o banco de dados bem-sucedida.');
            } else {
                Log::error('Erro: Conexão com o banco de dados falhou.');
                return response()->json(['status' => false, 'message' => 'Falha na conexão com o DB.'], 500);
            }
            // Agora tente a consulta
            $estados = Estado::orderBy('id', 'ASC')->get();

            return response()->json([
                'status' => true,
                'estados' => $estados,
            ], 200);

        } catch (\Exception $e) {
            // Registra o erro completo no log
            Log::error('Erro ao listar estados: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os estados. Verifique os logs do servidor.',
                'error_details' => $e->getMessage() // Para depuração, remova em produção
            ], 500);
        }
    }
    
    /*public function index(Request $request)
    {
        // Busca todos os estados da tabela 'estados' usando o modelo Estado
        $estados = Estado::all();

        // Retorna a lista de estados em formato JSON
        return response()->json([
            'status' => true,
            'message' => "Lista de estados obtida com sucesso.",
            'data' => $estados // Inclui os dados dos estados na resposta
        ], 200);
    }*/
    
    public function show(Estado $estado) : JsonResponse {
        return response()->json([
            'status' => true,
            'estado' => $estado
        ], 200);
    }
    
}
