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
    public function index()
    {
        try {
            // Busca todos os clientes, carregando os relacionamentos de cidade e gênero
            // O with(['cidade', 'genero']) garante que os dados relacionados sejam carregados
            // para evitar o problema de N+1 queries.
            $clientes = Cliente::with(['cidade', 'genero'])->orderBy('nome', 'ASC')->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de clientes obtida com sucesso.',
                'clientes' => $clientes,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar clientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os clientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Cliente $cliente)
    {
        try {
            // Busca o cliente pelo ID, carregando os relacionamentos
            $cliente = Cliente::with(['cidade', 'genero'])->find($cliente->id);

            // Verifica se o cliente foi encontrado
            if (!$cliente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Cliente obtido com sucesso.',
                'cliente' => $cliente,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao buscar cliente por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(ClienteRequest $request)
    {
        DB::beginTransaction();
        try {
            // Usamos $request->validated() para obter apenas os dados que passaram na validação.
            $cliente = Cliente::create($request->validated());

            DB::commit();

            // Retorna a confirmação de criação do cliente em formato JSON com status 201 Created
            return response()->json([
                'status' => true,
                'message' => 'Cliente criado com sucesso!',
                'cliente' => $cliente,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            // Em caso de erro, registra a exceção no log e retorna uma resposta de erro
            Log::error('Erro ao criar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500); // Código de status HTTP 500 para erro interno do servidor
        }
    }

    public function update(ClienteRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            // Encontra o cliente pelo ID
            $cliente = Cliente::find($id);

            // Se o cliente não for encontrado, retorna 404 Not Found
            if (!$cliente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o cliente com os dados validados
            // O fillable no modelo Cliente garante que apenas campos permitidos sejam atualizados
            $cliente->update($request->validated());

            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do cliente
            return response()->json([
                'status' => true,
                'message' => 'Cliente atualizado com sucesso!',
                'cliente' => $cliente,
            ], 200); // Código 200 OK para sucesso na atualização

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
