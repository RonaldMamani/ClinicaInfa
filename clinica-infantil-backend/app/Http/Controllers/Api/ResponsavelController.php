<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Responsavel;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResponsavelController extends Controller
{
    protected $relations = ['cliente.cidade.estado', 'pacientes.cliente'];

    public function index(): JsonResponse
    {
        try {
            $responsaveisAtivos = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->get();

            $responsaveisInativos = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Todos os responsáveis listados com sucesso.',
                'responsaveis_ativos' => $responsaveisAtivos,
                'responsaveis_inativos' => $responsaveisInativos,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar todos os responsáveis (index): ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar todos os responsáveis.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function getActiveResponsaveis(): JsonResponse
    {
        try {
            $responsaveis = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis ativos listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar responsáveis ativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis ativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function getInactiveResponsaveis(): JsonResponse
    {
        try {
            $responsaveis = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis inativos listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar responsáveis inativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis inativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function responsaveisAtivos(Request $request): JsonResponse
    {
        try {
            $perPage = $request->query('per_page', 10);
            $page = $request->query('page', 1);

            $responsaveis = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis ativos listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar responsáveis ativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis ativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
    
    public function responsaveisInativos(Request $request): JsonResponse
    {
        try {
            $perPage = $request->query('per_page', 10);
            $page = $request->query('page', 1);

            $responsaveis = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->with($this->relations)->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis inativos listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao listar responsáveis inativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis inativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function responsaveisListar(Request $request): JsonResponse
    {
        try {
            $perPage = $request->query('per_page', 10);
            $page = $request->query('page', 1);
            $status = $request->query('status');

            // Inicia a query com as relações necessárias
            $query = Responsavel::with($this->relations);

            // Aplica o filtro de status se o parâmetro for fornecido
            if (isset($status)) {
                // Converte a string do parâmetro para booleano
                $ativo = filter_var($status, FILTER_VALIDATE_BOOLEAN);

                $query->whereHas('cliente', function ($q) use ($ativo) {
                    $q->where('ativo', $ativo);
                });
            }

            // Aplica a paginação
            $responsaveis = $query->paginate($perPage, ['*'], 'page', $page);

            // Define a mensagem de sucesso com base no filtro
            $message = 'Responsáveis listados com sucesso.';
            if ($status === 'true') {
                $message = 'Responsáveis ativos listados com sucesso.';
            } elseif ($status === 'false') {
                $message = 'Responsáveis inativos listados com sucesso.';
            }

            return response()->json([
                'status' => true,
                'message' => $message,
                'responsaveis' => $responsaveis,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar responsáveis: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um responsável específico pelo seu ID.
     *
     * @param int $id O ID do responsável a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $responsavel = Responsavel::with([
                'cliente.cidade.estado',
                'pacientes.cliente'
            ])->find($id);

            if (!$responsavel) {
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do responsável carregados com sucesso.',
                'responsavel' => $responsavel,
            ], 200);
        } catch (Exception $e) {
            Log::error('Erro ao exibir responsável: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o responsável.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Atualiza um responsável existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo ResponsavelRequest.
     *
     * @param \App\Http\Requests\ResponsavelRequest $request A requisição validada pelo ResponsavelRequest.
     * @param int $id O ID do responsável a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            // Inicia uma transação de banco de dados para garantir a atomicidade das operações
            DB::beginTransaction();

            // 1. Tenta encontrar o responsável pelo ID fornecido, carregando o cliente associado
            $responsavel = Responsavel::with('cliente')->find($id);

            // 2. VERIFICAÇÃO CRUCIAL: Verifica se o responsável foi encontrado
            if (!$responsavel) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado.'
                ], 404);
            }

            // 3. Atualiza os dados do próprio Responsável
            // O método `only()` garante que apenas os campos permitidos sejam usados do request
            $responsavel->update($request->only(['grau_parentesco', 'email', 'telefone']));

            // 4. Atualiza os dados do Cliente associado ao Responsável
            // O `UpdateResponsavelRequest` já valida que 'cliente' é um array com os campos necessários
            $clienteData = $request->input('cliente');

            // Verifica se o cliente associado existe antes de tentar atualizá-lo
            if (!$responsavel->cliente) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Cliente associado ao responsável não encontrado.'
                ], 404);
            }

            $responsavel->cliente->update($clienteData);

            // 5. Confirma a transação se todas as operações foram bem-sucedidas
            DB::commit();

            // 6. Recarrega o responsável com os dados atualizados e suas relações para a resposta
            $responsavel->refresh()->load($this->relations);

            // 7. Retorna uma resposta de sucesso com o responsável atualizado
            return response()->json([
                'status' => true,
                'message' => 'Responsável atualizado com sucesso.',
                'responsavel' => $responsavel
            ], 200);

        } catch (Exception $e) {
            // Em caso de qualquer erro, reverte a transação
            DB::rollBack();
            Log::error("Erro ao atualizar responsável: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o responsável.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'ativo' => 'required|boolean',
        ]);

        try {
            $responsavel = Responsavel::find($id);

            if (!$responsavel) {
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado.'
                ], 404);
            }

            // Atualiza o status 'ativo' do cliente associado
            $responsavel->cliente->ativo = $request->input('ativo');
            $responsavel->cliente->save();

            $statusMessage = $request->input('ativo') ? 'reativado' : 'desativado';

            return response()->json([
                'status' => true,
                'message' => "Responsável {$statusMessage} com sucesso.",
                'responsavel' => $responsavel->load($this->relations)
            ], 200);

        } catch (Exception $e) {
            Log::error("Erro ao atualizar status do responsável: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o status do responsável.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

}
