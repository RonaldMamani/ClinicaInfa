<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Responsavel;
use App\Models\Paciente;
use App\Http\Requests\ClienteRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class ClienteController extends Controller
{
    /**
     * Lista todos os clientes do banco de dados,
     * incluindo os relacionamentos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Retorna todos os clientes com seus relacionamentos
            $clientes = Cliente::with(['cidade', 'genero', 'responsavel', 'paciente'])->get();

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

    /**
     * Exibe um cliente específico pelo seu ID.
     *
     * @param int $id O ID do cliente a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $cliente = Cliente::with(['cidade', 'genero', 'responsavel', 'paciente'])->find($id);

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

    /**
     * Cria um novo cliente, e opcionalmente um paciente e/ou responsável,
     * em uma única transação de banco de dados.
     *
     * @param \App\Http\Requests\ClienteRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ClienteRequest $request)
    {
        DB::beginTransaction();
        try {
            // Passo 1: Criar o Cliente (sempre é a primeira entidade a ser criada)
            $cliente = Cliente::create($request->only([
                'id_cidade',
                'id_genero',
                'cpf',
                'rg',
                'nome',
                'endereco',
                'ativo'
            ]));

            $responsavelId = null;

            // Passo 2 (Opcional): Criar o Responsável se os dados estiverem presentes
            if ($request->has('grau_parentesco') || $request->has('email') || $request->has('telefone')) {
                $responsavel = Responsavel::create([
                    'id_cliente' => $cliente->id,
                    'grau_parentesco' => $request->grau_parentesco,
                    'email' => $request->email,
                    'telefone' => $request->telefone,
                ]);
                $responsavelId = $responsavel->id;
            }

            // Passo 3 (Opcional): Criar o Paciente se os dados estiverem presentes
            if ($request->has('data_nascimento') || $request->has('historico_medico')) {
                $idDoResponsavel = $request->id_responsavel ?? $responsavelId;
                
                Paciente::create([
                    'id_cliente' => $cliente->id,
                    'id_responsavel' => $idDoResponsavel,
                    'data_nascimento' => $request->data_nascimento,
                    'historico_medico' => $request->historico_medico,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cliente e tipo(s) de cliente adicionado(s) com sucesso!',
                'cliente' => $cliente->load(['cidade', 'genero', 'responsavel', 'paciente']),
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar cliente e seus tipos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o cliente e/ou o tipo de cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

}