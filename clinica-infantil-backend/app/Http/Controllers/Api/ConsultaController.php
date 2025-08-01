<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConsultaRequest;
use App\Models\Consulta;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConsultaController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados para os métodos.
     * Adicionado 'paciente.cliente' para carregar os dados do cliente dentro do paciente.
     */
    protected $relations = [
        'paciente.cliente', 
        'medico.usuario.perfil', 
        'medico.usuario.funcionario'
    ];

    /**
     * Retorna a lista completa de consultas, com dados aninhados do paciente, médico e usuário.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $consultas = Consulta::with($this->relations)
                ->orderBy('id', 'ASC')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de consultas obtida com sucesso.',
                'consultas' => $consultas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar consultas: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe uma consulta específica pelo seu ID.
     *
     * @param int $id O ID da consulta a ser exibida.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $consulta = Consulta::with($this->relations)->find($id);

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Consulta obtida com sucesso.',
                'consulta' => $consulta,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar consulta por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar a consulta. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cria uma nova consulta no banco de dados.
     *
     * @param \App\Http\Requests\ConsultaRequest $request A requisição validada pelo ConsultaRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ConsultaRequest $request)
    {
        DB::beginTransaction();
        try {
            $consulta = Consulta::create($request->validated());
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Consulta criada com sucesso!',
                'consulta' => $consulta,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar consulta: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar a consulta. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza uma consulta existente no banco de dados.
     *
     * @param \App\Http\Requests\ConsultaRequest $request A requisição validada pelo ConsultaRequest.
     * @param int $id O ID da consulta a ser atualizada.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ConsultaRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $consulta = Consulta::find($id);

            if (!$consulta) {
                // ... (código existente)
            }
            
            $validatedData = $request->validated();
            
            // Aqui está o ponto de falha.
            // Adicione um log para ver os dados que estão chegando.
            Log::info('Dados validados para atualização: ', $validatedData);

            $consulta->update($validatedData); // A falha ocorre aqui
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Consulta atualizada com sucesso!',
                'consulta' => $consulta,
            ], 200);

        } catch (\Exception $e) { // Use \Exception para capturar qualquer tipo de erro
            DB::rollBack();
            
            // Retorne o erro detalhado para o front-end
            return response()->json([
                'status' => false,
                'message' => 'Erro interno do servidor',
                'error_details' => $e->getMessage() // Esta linha é a mais importante para debug
            ], 500);
        }
    }
    
    /**
     * Atualiza o status de uma consulta específica.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id O ID da consulta a ser atualizada.
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        try {
            $consulta = Consulta::find($id);

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.',
                ], 404);
            }

            $consulta->status = $request->input('status');
            $consulta->save();

            return response()->json([
                'status' => true,
                'message' => 'Status da consulta atualizado com sucesso.',
                'consulta' => $consulta,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o status da consulta: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o status da consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove uma consulta do banco de dados (delete físico).
     *
     * @param int $id O ID da consulta a ser removida.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $consulta = Consulta::find($id);

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada para exclusão.',
                ], 404);
            }

            $consulta->delete();
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Consulta excluída com sucesso!',
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao excluir consulta: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir a consulta. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a quantidade total de consultas.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function countAll()
    {
        try {
            $totalConsultas = Consulta::count();

            return response()->json([
                'status' => true,
                'message' => 'Quantidade total de consultas obtida com sucesso.',
                'total_consultas' => $totalConsultas,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao contar todas as consultas: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao contar todas as consultas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a quantidade de consultas agendadas (futuras).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function countScheduled()
    {
        try {
            $consultasAgendadas = Consulta::where('data_consulta', '>', now())->count();

            return response()->json([
                'status' => true,
                'message' => 'Quantidade de consultas agendadas obtida com sucesso.',
                'consultas_agendadas' => $consultasAgendadas,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao contar consultas agendadas: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao contar as consultas agendadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a lista de consultas agendadas, com os dados completos e aninhados.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function consultasAgendadas()
    {
        try {
            $consultasAgendadas = Consulta::with($this->relations)
                ->where('data_consulta', '>', now())
                ->orderBy('data_consulta', 'ASC')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de consultas agendadas obtida com sucesso.',
                'consultas_agendadas' => $consultasAgendadas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar consultas agendadas: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas agendadas. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}