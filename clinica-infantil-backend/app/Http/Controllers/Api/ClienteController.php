<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClienteRequest;
use App\Models\Cliente;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Lista todos os clientes ATIVOS.
     * Inclui os relacionamentos de cidade e gênero.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Busca apenas clientes ATIVOS, carregando os relacionamentos
            $clientes = Cliente::with(['cidade', 'genero'])
                                ->where('ativo', true) // Filtra por clientes ativos
                                ->orderBy('nome', 'ASC')
                                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de clientes ativos obtida com sucesso.',
                'clientes' => $clientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar clientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os clientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um cliente específico pelo seu ID (apenas se estiver ATIVO).
     *
     * @param int $id O ID do cliente a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Busca o cliente pelo ID, carregando os relacionamentos e verificando se está ativo
            $cliente = Cliente::with(['cidade', 'genero'])
                                ->where('id', $id)
                                ->where('ativo', true) // Filtra por cliente ativo
                                ->first(); // Usa first() pois find() não permite where encadeado desta forma

            // Verifica se o cliente foi encontrado e está ativo
            if (!$cliente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado ou inativo.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Cliente obtido com sucesso.',
                'cliente' => $cliente,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar cliente por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo cliente no banco de dados.
     *
     * @param \App\Http\Requests\ClienteRequest $request A requisição validada.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ClienteRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Se 'ativo' não for fornecido na requisição, ele usará o DEFAULT TRUE do banco.
            // Se for fornecido, será validado como booleano.
            $cliente = Cliente::create($data);
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cliente criado com sucesso!',
                'cliente' => $cliente,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um cliente existente no banco de dados.
     *
     * @param \App\Http\Requests\ClienteRequest $request A requisição validada.
     * @param int $id O ID do cliente a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ClienteRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $cliente = Cliente::find($id);

            if (!$cliente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado para atualização.',
                ], 404);
            }

            $cliente->update($request->validated());
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cliente atualizado com sucesso!',
                'cliente' => $cliente,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Realiza um "delete lógico" de um cliente, marcando-o como inativo.
     *
     * @param int $id O ID do cliente a ser "deletado" (marcado como inativo).
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $cliente = Cliente::find($id);

            // Verifica se o cliente foi encontrado e se já não está inativo
            if (!$cliente || !$cliente->ativo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado ou já está inativo.',
                ], 404);
            }

            // Marca o cliente como inativo (delete lógico)
            $cliente->update(['ativo' => false]);
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cliente inativado com sucesso (delete lógico)!',
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao inativar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao inativar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lista todos os clientes INATIVOS.
     * Inclui os relacionamentos de cidade e gênero.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInactiveClients()
    {
        try {
            // Busca apenas clientes INATIVOS, carregando os relacionamentos
            $clientes = Cliente::with(['cidade', 'genero'])
                                ->where('ativo', false) // Filtra por clientes inativos
                                ->orderBy('nome', 'ASC')
                                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de clientes inativos obtida com sucesso.',
                'clientes' => $clientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar clientes inativos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os clientes inativos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
