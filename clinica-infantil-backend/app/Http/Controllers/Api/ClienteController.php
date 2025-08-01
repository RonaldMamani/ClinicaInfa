<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
     * Cria um novo cliente, e opcionalmente um paciente e/ou responsável,
     * em uma única transação de banco de dados.
     *
     * @param \App\Http\Requests\ClienteRequest $request A requisição validada.
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
                'ativo' // Adicionado 'ativo' para ser criado com o cliente
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

    /**
     * Atualiza um cliente e seus dados relacionados.
     *
     * @param \App\Http\Requests\ClienteRequest $request
     * @param int $id
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

            // 1. Atualiza os dados principais do Cliente
            $cliente->update($request->only([
                'id_cidade',
                'id_genero',
                'cpf',
                'rg',
                'nome',
                'endereco',
                'ativo'
            ]));

            // 2. Lógica para Responsavel (Cria, Atualiza ou Deleta)
            $responsavelData = $request->only('grau_parentesco', 'email', 'telefone');
            if (!empty($responsavelData) && $request->has('grau_parentesco')) {
                // Tenta encontrar o responsável existente
                $responsavel = $cliente->responsavel;
                if ($responsavel) {
                    $responsavel->update($responsavelData);
                } else {
                    $cliente->responsavel()->create($responsavelData);
                }
            } else {
                // Se não há dados de responsável na requisição, remove o registro existente
                if ($cliente->responsavel) {
                    $cliente->responsavel()->delete();
                }
            }

            // 3. Lógica para Paciente (Cria, Atualiza ou Deleta)
            $pacienteData = $request->only('data_nascimento', 'historico_medico', 'id_responsavel');
            if (!empty($pacienteData) && $request->has('data_nascimento')) {
                 // Tenta encontrar o paciente existente
                $paciente = $cliente->paciente;
                if ($paciente) {
                    $paciente->update($pacienteData);
                } else {
                    $cliente->paciente()->create($pacienteData);
                }
            } else {
                // Se não há dados de paciente na requisição, remove o registro existente
                if ($cliente->paciente) {
                    $cliente->paciente()->delete();
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cliente e seus dados relacionados atualizados com sucesso!',
                'cliente' => $cliente->load(['cidade', 'genero', 'responsavel', 'paciente']),
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
     * Remove (logicamente) um cliente do banco de dados,
     * setando o campo 'ativo' para false.
     *
     * @param int $id O ID do cliente a ser desativado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $cliente = Cliente::find($id);

            if (!$cliente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente não encontrado para desativação.',
                ], 404);
            }
            
            // Realiza a exclusão lógica, setando o campo 'ativo' para false
            $cliente->update(['ativo' => false]);

            return response()->json([
                'status' => true,
                'message' => 'Cliente desativado (exclusão lógica) com sucesso!',
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao desativar cliente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao desativar o cliente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os clientes com o status 'ativo' = true.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveClients()
    {
        try {
            $clientes = Cliente::where('ativo', true)
                                ->with(['cidade', 'genero', 'responsavel', 'paciente'])
                                ->get();
            return response()->json([
                'status' => true,
                'message' => 'Lista de clientes ativos obtida com sucesso.',
                'clientes' => $clientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar clientes ativos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os clientes ativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os clientes com o status 'ativo' = false.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInactiveClients()
    {
        try {
            $clientes = Cliente::where('ativo', false)
                                ->with(['cidade', 'genero', 'responsavel', 'paciente'])
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
                'message' => 'Ocorreu um erro ao buscar os clientes inativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}