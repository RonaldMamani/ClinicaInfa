<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResponsavelRequest;
use App\Http\Requests\UpdateResponsavelRequest;
use App\Models\Responsavel;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResponsavelController extends Controller
{
    protected $relations = ['cliente.cidade.estado', 'pacientes.cliente'];

    public function index(Request $request): JsonResponse
    {
        try {
            // Obtém os números de página para cada lista da requisição
            $activePage = $request->query('active_page', 1);
            $inactivePage = $request->query('inactive_page', 1);

            // Responsáveis Ativos (onde o cliente associado está ativo)
            $responsaveisAtivos = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->paginate(10, ['*'], 'active_page', $activePage);

            // Responsáveis Inativos (onde o cliente associado está inativo)
            $responsaveisInativos = Responsavel::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->with($this->relations)->paginate(10, ['*'], 'inactive_page', $inactivePage);

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis listados com sucesso.',
                'responsaveis_ativos' => $responsaveisAtivos,
                'responsaveis_inativos' => $responsaveisInativos,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao listar responsáveis (index): ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function responsaveisAtivos(): JsonResponse
    {
        try {
            // Carrega os responsáveis com:
            // - cliente (que tem cidade e estado)
            // - pacientes (que tem cliente)
            $responsaveis = Responsavel::with([
                'cliente.cidade.estado', // Cliente -> Cidade -> Estado
                'pacientes.cliente'      // Responsavel -> Paciente -> Cliente do Paciente
            ])->paginate(10)
            ->where('')
            ;

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao listar responsáveis: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os responsáveis.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
    
    public function responsaveisInativos(): JsonResponse
    {
        try {
            // Carrega os responsáveis com:
            // - cliente (que tem cidade e estado)
            // - pacientes (que tem cliente)
            $responsaveis = Responsavel::with([
                'cliente.cidade.estado', // Cliente -> Cidade -> Estado
                'pacientes.cliente'      // Responsavel -> Paciente -> Cliente do Paciente
            ])->paginate(10);

            return response()->json([
                'status' => true,
                'message' => 'Responsáveis listados com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);
        } catch (\Exception $e) {
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
                'cliente.cidade.estado', // Carrega cliente, cidade e estado do responsável
                'pacientes.cliente'      // Carrega pacientes associados e o cliente de cada paciente
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
        } catch (\Exception $e) {
            Log::error('Erro ao exibir responsável: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o responsável.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo responsável no banco de dados.
     * A validação dos dados é realizada automaticamente pelo ResponsavelRequest.
     *
     * @param \App\Http\Requests\ResponsavelRequest $request A requisição validada pelo ResponsavelRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ResponsavelRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo responsável com os dados validados
            $responsavel = Responsavel::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do responsável
            return response()->json([
                'status' => true,
                'message' => 'Responsável criado com sucesso!',
                'responsavel' => $responsavel,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar responsável: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o responsável. Verifique os logs do servidor.',
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
    public function update(UpdateResponsavelRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction(); // Inicia uma transação de banco de dados

            $responsavel = Responsavel::with('cliente')->find($id);

            if (!$responsavel) {
                DB::rollBack(); // Reverte a transação em caso de erro
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado.'
                ], 404);
            }

            // Atualiza os dados do Responsável
            $responsavel->update($request->only(['grau_parentesco', 'email', 'telefone']));

            // Atualiza os dados do Cliente associado
            $clienteData = $request->input('cliente');
            $responsavel->cliente->update($clienteData);

            DB::commit(); // Confirma a transação

            return response()->json([
                'status' => true,
                'message' => 'Responsável atualizado com sucesso.',
                'responsavel' => $responsavel->load($this->relations) // Recarrega com as relações
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
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
                'responsavel' => $responsavel->load($this->relations) // Recarrega com as relações
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erro ao atualizar status do responsável: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o status do responsável.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um responsável do banco de dados (delete físico).
     *
     * @param int $id O ID do responsável a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o responsável pelo ID
            $responsavel = Responsavel::find($id);

            // Se o responsável não for encontrado, retorna 404 Not Found
            if (!$responsavel) {
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o responsável (delete físico)
            $responsavel->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Responsável excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir responsável: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o responsável. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
