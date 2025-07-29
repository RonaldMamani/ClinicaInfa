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
    public function index()
    {
        try {
            // Busca todas as consultas, carregando os dados relacionados de paciente e médico
            $consultas = Consulta::with(['paciente', 'medico'])->orderBy('data_consulta', 'DESC')->get();

            // Retorna a lista de consultas em formato JSON
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
            // Busca a consulta pelo ID, carregando os relacionamentos
            $consulta = Consulta::with(['paciente', 'medico'])->find($id);

            // Verifica se a consulta foi encontrada
            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.',
                ], 404);
            }

            // Retorna os detalhes da consulta em formato JSON
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
     * A validação dos dados é realizada automaticamente pelo ConsultaRequest.
     *
     * @param \App\Http\Requests\ConsultaRequest $request A requisição validada pelo ConsultaRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ConsultaRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria uma nova consulta com os dados validados
            $consulta = Consulta::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação da consulta
            return response()->json([
                'status' => true,
                'message' => 'Consulta criada com sucesso!',
                'consulta' => $consulta,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
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
     * A validação dos dados é realizada automaticamente pelo ConsultaRequest.
     *
     * @param \App\Http\Requests\ConsultaRequest $request A requisição validada pelo ConsultaRequest.
     * @param int $id O ID da consulta a ser atualizada.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ConsultaRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra a consulta pelo ID
            $consulta = Consulta::find($id);

            // Se a consulta não for encontrada, retorna 404 Not Found
            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada para atualização.',
                ], 404);
            }

            // Atualiza a consulta com os dados validados
            $consulta->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização da consulta
            return response()->json([
                'status' => true,
                'message' => 'Consulta atualizada com sucesso!',
                'consulta' => $consulta,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar consulta: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar a consulta. Verifique os logs do servidor.',
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
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra a consulta pelo ID
            $consulta = Consulta::find($id);

            // Se a consulta não for encontrada, retorna 404 Not Found
            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada para exclusão.',
                ], 404);
            }

            // Tenta deletar a consulta (delete físico)
            $consulta->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Consulta excluída com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir consulta: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir a consulta. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
