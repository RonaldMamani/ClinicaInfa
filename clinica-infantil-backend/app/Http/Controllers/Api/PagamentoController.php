<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PagamentoRequest;
use App\Http\Requests\PagamentoStoreRequest;
use App\Http\Requests\PagamentoUpdateRequest;
use App\Models\Pagamento;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PagamentoController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados.
     */
    protected $relations = [
        'consulta.paciente.cliente',
        'consulta.medico.usuario.funcionario',
    ];

    /**
     * Lista todos os pagamentos do banco de dados,
     * incluindo os relacionamentos e com paginação.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Carrega os pagamentos com os relacionamentos e ordena pela data de pagamento
            $pagamentos = Pagamento::with($this->relations)
                ->orderBy('data_pagamento', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => true,
                'message' => 'Pagamentos listados com sucesso.',
                'pagamentos' => $pagamentos,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar pagamentos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os pagamentos. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Exibe um pagamento específico pelo seu ID.
     *
     * @param Pagamento $pagamento O pagamento a ser exibido (via Route Model Binding).
     * @return JsonResponse
     */
    public function show(Pagamento $pagamento): JsonResponse
    {
        try {
            // Carrega os relacionamentos do pagamento encontrado
            $pagamento->load($this->relations);

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do pagamento carregados com sucesso.',
                'pagamento' => $pagamento,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao buscar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o pagamento. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Cria um novo pagamento no banco de dados.
     *
     * @param PagamentoStoreRequest $request A requisição validada.
     * @return JsonResponse
     */
    public function store(PagamentoStoreRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // Cria um novo pagamento com os dados validados
            $pagamento = Pagamento::create($request->validated());
            DB::commit();

            // Retorna a confirmação de criação do pagamento
            return response()->json([
                'status' => true,
                'message' => 'Pagamento criado com sucesso!',
                'pagamento' => $pagamento->load($this->relations),
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o pagamento. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Atualiza um pagamento existente.
     *
     * @param PagamentoUpdateRequest $request A requisição validada.
     * @param Pagamento $pagamento O pagamento a ser atualizado (via Route Model Binding).
     * @return JsonResponse
     */
    public function update(PagamentoUpdateRequest $request, Pagamento $pagamento): JsonResponse
    {
        DB::beginTransaction();
        try {
            $pagamento->update($request->validated());
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Pagamento atualizado com sucesso.',
                'pagamento' => $pagamento->load($this->relations),
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o pagamento. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Deleta um pagamento.
     *
     * @param Pagamento $pagamento O pagamento a ser deletado (via Route Model Binding).
     * @return JsonResponse
     */
    public function destroy(Pagamento $pagamento): JsonResponse
    {
        DB::beginTransaction();
        try {
            $pagamento->delete();
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Pagamento deletado com sucesso.',
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao deletar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao deletar o pagamento. Verifique os logs do servidor.',
            ], 500);
        }
    }
}
