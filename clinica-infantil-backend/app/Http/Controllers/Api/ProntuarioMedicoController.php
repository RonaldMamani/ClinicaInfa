<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProntuarioMedicoRequest;
use App\Models\ProntuarioMedico;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProntuarioMedicoController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os prontuários, carregando os dados relacionados
            $prontuarios = ProntuarioMedico::with(['paciente', 'medico', 'consulta'])
                                           ->orderBy('data_diagnostico', 'DESC')
                                           ->get();

            // Retorna a lista de prontuários em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de prontuários médicos obtida com sucesso.',
                'prontuarios' => $prontuarios,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar prontuários médicos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os prontuários médicos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um prontuário médico específico pelo seu ID.
     *
     * @param int $id O ID do prontuário a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Busca o prontuário pelo ID, carregando os relacionamentos
            $prontuario = ProntuarioMedico::with(['paciente', 'medico', 'consulta'])->find($id);

            // Verifica se o prontuário foi encontrado
            if (!$prontuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Prontuário médico não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do prontuário em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Prontuário médico obtido com sucesso.',
                'prontuario' => $prontuario,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar prontuário médico por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o prontuário médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo prontuário médico no banco de dados.
     * A validação dos dados é realizada automaticamente pelo ProntuarioMedicoRequest.
     *
     * @param \App\Http\Requests\ProntuarioMedicoRequest $request A requisição validada.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ProntuarioMedicoRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo prontuário com os dados validados
            $prontuario = ProntuarioMedico::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do prontuário
            return response()->json([
                'status' => true,
                'message' => 'Prontuário médico criado com sucesso!',
                'prontuario' => $prontuario,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar prontuário médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o prontuário médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um prontuário médico existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo ProntuarioMedicoRequest.
     *
     * @param \App\Http\Requests\ProntuarioMedicoRequest $request A requisição validada.
     * @param int $id O ID do prontuário a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ProntuarioMedicoRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o prontuário pelo ID
            $prontuario = ProntuarioMedico::find($id);

            // Se o prontuário não for encontrado, retorna 404 Not Found
            if (!$prontuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Prontuário médico não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o prontuário com os dados validados
            $prontuario->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do prontuário
            return response()->json([
                'status' => true,
                'message' => 'Prontuário médico atualizado com sucesso!',
                'prontuario' => $prontuario,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar prontuário médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o prontuário médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um prontuário médico do banco de dados (delete físico).
     *
     * @param int $id O ID do prontuário a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o prontuário pelo ID
            $prontuario = ProntuarioMedico::find($id);

            // Se o prontuário não for encontrado, retorna 404 Not Found
            if (!$prontuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Prontuário médico não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o prontuário (delete físico)
            $prontuario->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Prontuário médico excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir prontuário médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o prontuário médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
