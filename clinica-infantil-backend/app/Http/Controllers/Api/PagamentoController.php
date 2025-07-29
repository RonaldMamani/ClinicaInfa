<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PagamentoRequest;
use App\Models\Pagamento;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PagamentoController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os pagamentos, carregando os dados relacionados da consulta
            $pagamentos = Pagamento::with('consulta')->orderBy('data_pagamento', 'DESC')->get();

            // Retorna a lista de pagamentos em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de pagamentos obtida com sucesso.',
                'pagamentos' => $pagamentos,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar pagamentos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os pagamentos. Verifique os logs do servidor.',
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
    public function show($id)
    {
        try {
            // Busca o pagamento pelo ID, carregando o relacionamento com a consulta
            $pagamento = Pagamento::with('consulta')->find($id);

            // Verifica se o pagamento foi encontrado
            if (!$pagamento) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pagamento não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do pagamento em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Pagamento obtido com sucesso.',
                'pagamento' => $pagamento,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar pagamento por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o pagamento. Verifique os logs do servidor.',
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

    /**
     * Atualiza um pagamento existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PagamentoRequest.
     *
     * @param \App\Http\Requests\PagamentoRequest $request A requisição validada pelo PagamentoRequest.
     * @param int $id O ID do pagamento a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PagamentoRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o pagamento pelo ID
            $pagamento = Pagamento::find($id);

            // Se o pagamento não for encontrado, retorna 404 Not Found
            if (!$pagamento) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pagamento não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o pagamento com os dados validados
            $pagamento->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do pagamento
            return response()->json([
                'status' => true,
                'message' => 'Pagamento atualizado com sucesso!',
                'pagamento' => $pagamento,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o pagamento. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um pagamento do banco de dados (delete físico).
     *
     * @param int $id O ID do pagamento a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o pagamento pelo ID
            $pagamento = Pagamento::find($id);

            // Se o pagamento não for encontrado, retorna 404 Not Found
            if (!$pagamento) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pagamento não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o pagamento (delete físico)
            $pagamento->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Pagamento excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir pagamento: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o pagamento. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
