<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicoRequest;
use App\Models\Medico;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MedicoController extends Controller
{
    protected $relations = [
        'usuario.perfil',
        'usuario.funcionario',
        'consultas',
    ];

    /**
     * Retorna a lista completa de médicos, com dados aninhados.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $medicos = Medico::whereHas('usuario', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->get();

            // Verifica se a lista de médicos está vazia.
            if ($medicos->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Nenhum médico ativo encontrado.',
                    'medicos' => [],
                ], 200);
            }

            return response()->json([
                'status' => true,
                'message' => 'Lista de médicos ativos obtida com sucesso.',
                'medicos' => $medicos,
            ], 200);

        } catch (\Exception $e) {
            // Se houver qualquer erro na execução, ele será capturado aqui.
            Log::error('Erro ao listar médicos ativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os médicos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um médico específico pelo seu ID.
     *
     * @param int $id O ID do médico a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Busca o médico pelo ID, carregando o relacionamento com o usuário
            $medico = Medico::with('usuario')->find($id);

            // Verifica se o médico foi encontrado
            if (!$medico) {
                return response()->json([
                    'status' => false,
                    'message' => 'Médico não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do médico em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Médico obtido com sucesso.',
                'medico' => $medico,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar médico por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo médico no banco de dados.
     * A validação dos dados é realizada automaticamente pelo MedicoRequest.
     *
     * @param \App\Http\Requests\MedicoRequest $request A requisição validada pelo MedicoRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(MedicoRequest $request)
    {
        DB::beginTransaction();
        try {
            // Cria um novo médico com os dados validados
            $medico = Medico::create($request->validated());
            DB::commit();

            // Retorna a confirmação de criação do médico
            return response()->json([
                'status' => true,
                'message' => 'Médico criado com sucesso!',
                'medico' => $medico,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
