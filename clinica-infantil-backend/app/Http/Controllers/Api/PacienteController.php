<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PacienteRequest;
use Illuminate\Http\Request;
use App\Models\Paciente;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class PacienteController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados.
     */
    protected $relations = ['cliente.cidade', 'cliente.genero', 'responsavel'];

    /**
     * Lista todos os pacientes do banco de dados,
     * incluindo os relacionamentos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Retorna todos os pacientes com seus relacionamentos aninhados
            $pacientes = Paciente::with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de pacientes obtida com sucesso.',
                'pacientes' => $pacientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar pacientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os pacientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a quantidade total de pacientes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPatientsCount()
    {
        try {
            $totalPacientes = Paciente::countPatients();

            return response()->json([
                'status' => true,
                'message' => 'Contagem total de pacientes obtida com sucesso.',
                'total_pacientes' => $totalPacientes,
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Erro ao contar pacientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao contar os pacientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os pacientes cujo cliente associado está ativo.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActivePatients()
    {
        try {
            // Usa 'whereHas' para filtrar pacientes cujo cliente relacionado tem 'ativo' = true
            $pacientes = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de pacientes ativos obtida com sucesso.',
                'pacientes' => $pacientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar pacientes ativos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os pacientes ativos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os pacientes cujo cliente associado está inativo.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInactivePatients()
    {
        try {
            // Usa 'whereHas' para filtrar pacientes cujo cliente relacionado tem 'ativo' = false
            $pacientes = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de pacientes inativos obtida com sucesso.',
                'pacientes' => $pacientes,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar pacientes inativos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os pacientes inativos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um paciente específico pelo seu ID.
     *
     * @param int $id O ID do paciente a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $paciente = Paciente::with($this->relations)->find($id);

            if (!$paciente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paciente não encontrado.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Paciente obtido com sucesso.',
                'paciente' => $paciente,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar paciente por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o paciente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um paciente e seus dados de cliente.
     *
     * @param \App\Http\Requests\PacienteUpdateRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // 1. Tenta encontrar o paciente pelo ID fornecido na URL.
        // O método find() retorna null se o paciente não for encontrado.
        $paciente = Paciente::find($id);

        // 2. VERIFICAÇÃO CRUCIAL:
        // Verifica se a variável $paciente não é nula.
        // Se for null, significa que o ID não existe no banco.
        if (is_null($paciente)) {
            // Retorna uma resposta de erro com o status 404 (Not Found).
            return response()->json([
                'status' => false,
                'message' => 'Paciente não encontrado.'
            ], 404);
        }

        // 3. Validação dos dados do request.
        // Adapte as regras de validação conforme a sua necessidade.
        $request->validate([
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|max:14',
            'rg' => 'required|string|max:20',
            'endereco' => 'required|string',
            'id_cidade' => 'required|integer|exists:cidades,id',
            'id_genero' => 'required|integer|exists:generos,id',
            'historico_medico' => 'nullable|string',
            'data_nascimento' => 'required|date',
            'id_responsavel' => 'required|integer|exists:responsaveis,id',
        ]);
        
        // 4. Atualiza os dados do cliente (relacionamento).
        // Acessa a relação 'cliente' do paciente.
        // A verificação de 'is_null($paciente)' acima garante que $paciente->cliente não será chamado em um objeto nulo.
        $cliente = $paciente->cliente;

        // VERIFICAÇÃO ADICIONAL: Se, por algum motivo, a relação com o cliente não existir.
        if (is_null($cliente)) {
             return response()->json([
                'status' => false,
                'message' => 'O cliente associado a este paciente não foi encontrado.'
            ], 404);
        }

        $cliente->update([
            'nome' => $request->nome,
            'cpf' => $request->cpf,
            'rg' => $request->rg,
            'endereco' => $request->endereco,
            'id_cidade' => $request->id_cidade,
            'id_genero' => $request->id_genero,
        ]);

        // 5. Atualiza os dados do próprio paciente.
        $paciente->update([
            'historico_medico' => $request->historico_medico,
            'data_nascimento' => $request->data_nascimento,
            'id_responsavel' => $request->id_responsavel,
        ]);

        // 6. Recarrega o paciente com os dados atualizados e suas relações.
        $paciente->refresh()->load(['cliente.cidade', 'cliente.genero', 'responsavel']);

        // 7. Retorna uma resposta de sucesso com o paciente atualizado.
        return response()->json([
            'status' => true,
            'message' => 'Paciente atualizado com sucesso.',
            'paciente' => $paciente
        ]);
    }

    /**
     * Remove (logicamente) um paciente, setando o campo 'ativo' do cliente associado para false.
     *
     * @param int $id O ID do paciente a ser desativado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $paciente = Paciente::with('cliente')->find($id);

            if (!$paciente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paciente não encontrado para desativação.',
                ], 404);
            }

            // Realiza a exclusão lógica, setando o campo 'ativo' do cliente para false
            $paciente->cliente->update(['ativo' => false]);

            return response()->json([
                'status' => true,
                'message' => 'Paciente desativado (exclusão lógica) com sucesso!',
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao desativar paciente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao desativar o paciente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}