<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResponsavelRequest;
use App\Models\Responsavel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResponsavelController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os responsáveis, carregando os dados relacionados do cliente
            $responsaveis = Responsavel::with('cliente')->orderBy('grau_parentesco', 'ASC')->get();

            // Retorna a lista de responsáveis em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de responsáveis obtida com sucesso.',
                'responsaveis' => $responsaveis,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar responsáveis: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os responsáveis. Verifique os logs do servidor.',
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
    public function show($id)
    {
        try {
            // Busca o responsável pelo ID, carregando o relacionamento com o cliente
            $responsavel = Responsavel::with('cliente')->find($id);

            // Verifica se o responsável foi encontrado
            if (!$responsavel) {
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do responsável em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Responsável obtido com sucesso.',
                'responsavel' => $responsavel,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar responsável por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o responsável. Verifique os logs do servidor.',
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
    public function update(ResponsavelRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o responsável pelo ID
            $responsavel = Responsavel::find($id);

            // Se o responsável não for encontrado, retorna 404 Not Found
            if (!$responsavel) {
                return response()->json([
                    'status' => false,
                    'message' => 'Responsável não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o responsável com os dados validados
            $responsavel->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do responsável
            return response()->json([
                'status' => true,
                'message' => 'Responsável atualizado com sucesso!',
                'responsavel' => $responsavel,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar responsável: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o responsável. Verifique os logs do servidor.',
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
