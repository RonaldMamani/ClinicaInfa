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

    public function pacientesPaginacao(Request $request)
    {
        try {
            // Inicia a query do Paciente e carrega os relacionamentos necessários
            $query = Paciente::with($this->relations);

            // Filtra os pacientes com base no parâmetro 'ativo' na URL
            // Ex: /api/pacientes/paginacao?ativo=true ou /api/pacientes/paginacao?ativo=false
            if ($request->has('ativo')) {
                $ativo = filter_var($request->input('ativo'), FILTER_VALIDATE_BOOLEAN);
                $query->whereHas('cliente', function ($q) use ($ativo) {
                    $q->where('ativo', $ativo);
                });
            }

            // Pagina os resultados, 10 por página por padrão
            $pacientes = $query->paginate(10);

            // Monta a mensagem de sucesso com base no filtro aplicado
            $message = 'Lista de pacientes paginada obtida com sucesso.';
            if ($request->has('ativo')) {
                $message = $ativo ? 'Lista de pacientes ativos paginada obtida com sucesso.' : 'Lista de pacientes inativos paginada obtida com sucesso.';
            }

            return response()->json([
                'status' => true,
                'message' => $message,
                'pacientes' => $pacientes,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar pacientes paginados: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os pacientes. Verifique os logs do servidor.',
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

        } catch (Exception $e) {
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

        } catch (Exception $e) {
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
        $paciente = Paciente::find($id);

        if (is_null($paciente)) {
            // Retorna uma resposta de erro com o status 404 (Not Found).
            return response()->json([
                'status' => false,
                'message' => 'Paciente não encontrado.'
            ], 404);
        }

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
        
        $cliente = $paciente->cliente;

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

        $paciente->update([
            'historico_medico' => $request->historico_medico,
            'data_nascimento' => $request->data_nascimento,
            'id_responsavel' => $request->id_responsavel,
        ]);

        $paciente->refresh()->load(['cliente.cidade', 'cliente.genero', 'responsavel']);

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

    /**
     * Retorna a quantidade total de pacientes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function contarPacientes()
    {
        try {
            $ativos = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->count();
            
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

        } catch (Exception $e) {
            Log::error('Erro ao contar pacientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao contar os pacientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}