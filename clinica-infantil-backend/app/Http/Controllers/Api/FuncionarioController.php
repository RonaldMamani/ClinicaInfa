<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FuncionarioRequest;
use App\Models\Funcionario;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FuncionarioController extends Controller
{
    public function index()
    {
        try {
            // Busca todos os funcionários, ordenando-os pelo nome
            $funcionarios = Funcionario::orderBy('nome', 'ASC')->get();

            // Retorna a lista de funcionários em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de funcionários obtida com sucesso.',
                'funcionarios' => $funcionarios,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar funcionários: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os funcionários. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Busca o funcionário pelo ID
            $funcionario = Funcionario::find($id);

            // Verifica se o funcionário foi encontrado
            if (!$funcionario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Funcionário não encontrado.',
                ], 404);
            }

            // Retorna os detalhes do funcionário em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Funcionário obtido com sucesso.',
                'funcionario' => $funcionario,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao buscar funcionário por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o funcionário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(FuncionarioRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Cria um novo funcionário com os dados validados
            $funcionario = Funcionario::create($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do funcionário
            return response()->json([
                'status' => true,
                'message' => 'Funcionário criado com sucesso!',
                'funcionario' => $funcionario,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar funcionário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o funcionário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(FuncionarioRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o funcionário pelo ID
            $funcionario = Funcionario::find($id);

            // Se o funcionário não for encontrado, retorna 404 Not Found
            if (!$funcionario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Funcionário não encontrado para atualização.',
                ], 404);
            }

            // Atualiza o funcionário com os dados validados
            $funcionario->update($request->validated());
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do funcionário
            return response()->json([
                'status' => true,
                'message' => 'Funcionário atualizado com sucesso!',
                'funcionario' => $funcionario,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar funcionário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o funcionário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}