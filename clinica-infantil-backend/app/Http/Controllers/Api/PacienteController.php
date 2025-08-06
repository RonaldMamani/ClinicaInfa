<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Paciente;
use Illuminate\Support\Facades\Log;
use Exception;

class PacienteController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados.
     */
    protected $relations = ['cliente.cidade', 'cliente.genero', 'responsavel', 'responsavel.cliente', 'consultas'];

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
    public function contarPacientes()
    {
        try {
            // Conta os pacientes cujo cliente relacionado tem 'ativo' = true
            $ativos = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->count();
            
            // Conta os pacientes cujo cliente relacionado tem 'ativo' = false
            $inativos = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->count();

            return response()->json([
                'status' => true,
                'message' => 'Contagem de pacientes ativos e inativos realizada com sucesso.',
                'dados' => [
                    'ativos' => $ativos,
                    'inativos' => $inativos
                ]
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
    public function pacientesAtivos()
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
    public function pacientesInativos()
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
        // 1. Encontra o paciente pelo ID fornecido.
        $paciente = Paciente::find($id);

        // 2. VERIFICAÇÃO DE SEGURANÇA:
        // Se o paciente não for encontrado, retorna uma resposta de erro 404.
        if (is_null($paciente)) {
            return response()->json([
                'status' => false,
                'message' => 'Paciente não encontrado.'
            ], 404);
        }

        // 3. Atualiza o status 'ativo' do paciente e do cliente associado para 0.
        // Acessamos o relacionamento 'cliente' do paciente.
        // A verificação de 'is_null($paciente)' acima garante que a relação existe.
        $cliente = $paciente->cliente;

        // Se o cliente não for encontrado (por segurança extra)
        if (is_null($cliente)) {
            return response()->json([
                'status' => false,
                'message' => 'O cliente associado a este paciente não foi encontrado.'
            ], 404);
        }

        // Atualiza ambos os registros para inativo.
        $paciente->update(['ativo' => 0]);
        $cliente->update(['ativo' => 0]);

        // 4. Retorna uma resposta de sucesso.
        return response()->json([
            'status' => true,
            'message' => 'Paciente desativado com sucesso.'
        ]);
    }
}