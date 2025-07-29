<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicoRequest;
use App\Models\Medico;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MedicoController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os médicos, carregando os dados relacionados do usuário
            $medicos = Medico::with('usuario')->orderBy('especialidade', 'ASC')->get();

            // Retorna a lista de médicos em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de médicos obtida com sucesso.',
                'medicos' => $medicos,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar médicos: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os médicos. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um médico específico pelo seu ID.
     *
     * @param int $id O ID do médico a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Busca o médico pelo ID, carregando o relacionamento com o usuário
            $medico = Medico::with('usuario')->find($id);

            // Verifica se o médico foi encontrado
            if (!$medico) {
                return response()->json([
                    'status' => false,
                    'message' => 'Médico não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do médico em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Médico obtido com sucesso.',
                'medico' => $medico,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar médico por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo médico no banco de dados.
     * A validação dos dados é realizada automaticamente pelo MedicoRequest.
     *
     * @param \App\Http\Requests\MedicoRequest $request A requisição validada pelo MedicoRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(MedicoRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo médico com os dados validados
            $medico = Medico::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do médico
            return response()->json([
                'status' => true,
                'message' => 'Médico criado com sucesso!',
                'medico' => $medico,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um médico existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo MedicoRequest.
     *
     * @param \App\Http\Requests\MedicoRequest $request A requisição validada pelo MedicoRequest.
     * @param int $id O ID do médico a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(MedicoRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o médico pelo ID
            $medico = Medico::find($id);

            // Se o médico não for encontrado, retorna 404 Not Found
            if (!$medico) {
                return response()->json([
                    'status' => false,
                    'message' => 'Médico não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o médico com os dados validados
            $medico->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do médico
            return response()->json([
                'status' => true,
                'message' => 'Médico atualizado com sucesso!',
                'medico' => $medico,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um médico do banco de dados (delete físico).
     *
     * @param int $id O ID do médico a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o médico pelo ID
            $medico = Medico::find($id);

            // Se o médico não for encontrado, retorna 404 Not Found
            if (!$medico) {
                return response()->json([
                    'status' => false,
                    'message' => 'Médico não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o médico (delete físico)
            $medico->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Médico excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir médico: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o médico. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
