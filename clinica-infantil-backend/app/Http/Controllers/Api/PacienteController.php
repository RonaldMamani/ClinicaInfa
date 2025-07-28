<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PacienteRequest;
use App\Models\Paciente;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PacienteController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os pacientes, carregando os dados relacionados de cliente e responsável
            $pacientes = Paciente::with(['cliente', 'responsavel'])->orderBy('data_nascimento', 'ASC')->get();

            // Retorna a lista de pacientes em formato JSON
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
                'error_details' => $e->getMessage() // Detalhes do erro para depuração (remover em produção)
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
            // Busca o paciente pelo ID, carregando os relacionamentos
            $paciente = Paciente::with(['cliente', 'responsavel'])->find($id);

            // Verifica se o paciente foi encontrado
            if (!$paciente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paciente não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do paciente em formato JSON
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
     * Cria um novo paciente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PacienteRequest.
     *
     * @param \App\Http\Requests\PacienteRequest $request A requisição validada pelo PacienteRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PacienteRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo paciente com os dados validados
            $paciente = Paciente::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do paciente
            return response()->json([
                'status' => true,
                'message' => 'Paciente criado com sucesso!',
                'paciente' => $paciente,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar paciente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o paciente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um paciente existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PacienteRequest.
     *
     * @param \App\Http\Requests\PacienteRequest $request A requisição validada pelo PacienteRequest.
     * @param int $id O ID do paciente a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PacienteRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o paciente pelo ID
            $paciente = Paciente::find($id);

            // Se o paciente não for encontrado, retorna 404 Not Found
            if (!$paciente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paciente não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o paciente com os dados validados
            $paciente->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do paciente
            return response()->json([
                'status' => true,
                'message' => 'Paciente atualizado com sucesso!',
                'paciente' => $paciente,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar paciente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o paciente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um paciente do banco de dados (delete físico).
     *
     * @param int $id O ID do paciente a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o paciente pelo ID
            $paciente = Paciente::find($id);

            // Se o paciente não for encontrado, retorna 404 Not Found
            if (!$paciente) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paciente não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o paciente (delete físico)
            $paciente->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Paciente excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir paciente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o paciente. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
