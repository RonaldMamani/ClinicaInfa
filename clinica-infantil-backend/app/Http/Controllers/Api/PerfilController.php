<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerfilRequest;
use App\Models\Perfil;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PerfilController extends Controller
{
    /**
     * Lista todos os perfis do banco de dados.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Busca todos os perfis, ordenando-os pelo nome
            $perfis = Perfil::orderBy('nome_perfil', 'ASC')->get();

            // Retorna a lista de perfis em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de perfis obtida com sucesso.',
                'perfis' => $perfis,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar perfis: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os perfis. Verifique os logs do servidor.',
                'error_details' => $e->getMessage() // Detalhes do erro para depuração (remover em produção)
            ], 500);
        }
    }

    /**
     * Exibe um perfil específico pelo seu ID.
     *
     * @param int $id O ID do perfil a ser exibido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Busca o perfil pelo ID
            $perfil = Perfil::find($id);

            // Verifica se o perfil foi encontrado
            if (!$perfil) {
                return response()->json([
                    'status' => false,
                    'message' => 'Perfil não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do perfil em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Perfil obtido com sucesso.',
                'perfil' => $perfil,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar perfil por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o perfil. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo perfil no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PerfilRequest.
     *
     * @param \App\Http\Requests\PerfilRequest $request A requisição validada pelo PerfilRequest.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PerfilRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo perfil com os dados validados
            $perfil = Perfil::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do perfil
            return response()->json([
                'status' => true,
                'message' => 'Perfil criado com sucesso!',
                'perfil' => $perfil,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar perfil: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o perfil. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um perfil existente no banco de dados.
     * A validação dos dados é realizada automaticamente pelo PerfilRequest.
     *
     * @param \App\Http\Requests\PerfilRequest $request A requisição validada pelo PerfilRequest.
     * @param int $id O ID do perfil a ser atualizado.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PerfilRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o perfil pelo ID
            $perfil = Perfil::find($id);

            // Se o perfil não for encontrado, retorna 404 Not Found
            if (!$perfil) {
                return response()->json([
                    'status' => false,
                    'message' => 'Perfil não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o perfil com os dados validados
            $perfil->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do perfil
            return response()->json([
                'status' => true,
                'message' => 'Perfil atualizado com sucesso!',
                'perfil' => $perfil,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar perfil: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o perfil. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um perfil do banco de dados.
     *
     * @param int $id O ID do perfil a ser removido.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o perfil pelo ID
            $perfil = Perfil::find($id);

            // Se o perfil não for encontrado, retorna 404 Not Found
            if (!$perfil) {
                return response()->json([
                    'status' => false,
                    'message' => 'Perfil não encontrado para exclusão.',
                ], 404);
            }

            // Tenta deletar o perfil
            $perfil->delete();
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de exclusão
            return response()->json([
                'status' => true,
                'message' => 'Perfil excluído com sucesso!',
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao excluir perfil: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o perfil. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
