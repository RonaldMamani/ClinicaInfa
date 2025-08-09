<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PagamentoRequest;
use App\Models\Pagamento;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PagamentoController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            // Carrega os pagamentos e as consultas relacionadas,
            // garantindo que os dados do paciente e médico também sejam carregados
            $pagamentos = Pagamento::with([
                'consulta.paciente.cliente',
                'consulta.medico.usuario.funcionario'
            ])
            ->orderBy('data_pagamento', 'desc')
            ->paginate(10);

            return response()->json([
                'status' => true,
                'message' => 'Pagamentos listados com sucesso.',
                'pagamentos' => $pagamentos,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar pagamentos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os pagamentos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um pagamento específico pelo seu ID.
     *
     * @param int $id O ID do pagamento a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            // Usando findOrFail para retornar 404 automaticamente se não encontrar
            $pagamento = Pagamento::with([
                'consulta.paciente.cliente',
                'consulta.medico.usuario.funcionario'
            ])->findOrFail($id);

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do pagamento carregados com sucesso.',
                'pagamento' => $pagamento,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Pagamento não encontrado.'
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao buscar pagamento: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o pagamento.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo pagamento no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PagamentoRequest.
     *
     * @param \App\Http\Requests\PagamentoRequest $request A requisição validada pelo PagamentoRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PagamentoRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo pagamento com os dados validados
            $pagamento = Pagamento::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do pagamento
            return response()->json([
                'status' => true,
                'message' => 'Pagamento criado com sucesso!',
                'pagamento' => $pagamento,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o pagamento. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(PagamentoRequest $request, int $id): JsonResponse
    {
        try {
            // Usando findOrFail para retornar 404 automaticamente se não encontrar
            $pagamento = Pagamento::findOrFail($id);

            $pagamento->update($request->validated());

            return response()->json([
                'status' => true,
                'message' => 'Pagamento atualizado com sucesso.',
                'pagamento' => $pagamento->load([
                    'consulta.paciente.cliente',
                    'consulta.medico.usuario.funcionario'
                ]),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Pagamento não encontrado.'
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao atualizar pagamento: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o pagamento.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
