<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsuarioRequest;
use App\Models\Usuario;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    public function index()
    {
        try {
            // Busca apenas usuários ATIVOS, carregando os dados relacionados de perfil e funcionário
            // Ordena os resultados pelo username em ordem ascendente
            $usuarios = Usuario::with(['perfil', 'funcionario'])
                                ->where('ativo', true) // Adicionado: Filtra apenas usuários ativos
                                ->orderBy('username', 'ASC')
                                ->get();

            // Retorna a lista de usuários em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Lista de usuários ativos obtida com sucesso.',
                'usuarios' => $usuarios,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar usuários: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar os usuários. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Busca o usuário pelo ID, carregando os relacionamentos e verificando se está ativo
            $usuario = Usuario::with(['perfil', 'funcionario'])
                                ->where('id', $id)
                                ->where('ativo', true) // Adicionado: Filtra apenas se o usuário estiver ativo
                                ->first(); // Usa first() pois find() não permite where encadeado desta forma

            // Verifica se o usuário foi encontrado e está ativo
            if (!$usuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado ou inativo.',
                ], 404);
            }

            // Retorna os detalhes do usuário em formato JSON
            return response()->json([
                'status' => true,
                'message' => 'Usuário obtido com sucesso.',
                'usuario' => $usuario,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar usuário por ID: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o usuário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(UsuarioRequest $request)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            $data = $request->validated();

            // HASH da senha antes de salvar no banco de dados
            $data['senha'] = Hash::make($data['senha']);

            // Cria um novo usuário com os dados validados e a senha hashada
            $usuario = Usuario::create($data);
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de criação do usuário
            return response()->json([
                'status' => true,
                'message' => 'Usuário criado com sucesso!',
                'usuario' => $usuario,
            ], 201); // Código 201 Created

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao criar usuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o usuário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UsuarioRequest $request, $id)
    {
        DB::beginTransaction(); // Inicia a transação
        try {
            // Encontra o usuário pelo ID
            $usuario = Usuario::find($id);

            // Se o usuário não for encontrado, retorna 404 Not Found
            if (!$usuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado para atualização.',
                ], 404);
            }

            $data = $request->validated();

            // Se uma nova senha foi fornecida, faça o HASH dela
            if (isset($data['senha']) && !empty($data['senha'])) {
                $data['senha'] = Hash::make($data['senha']);
            } else {
                // Se a senha não foi fornecida na requisição, remove-a dos dados para não sobrescrever
                unset($data['senha']);
            }

            // Atualiza o usuário com os dados validados (e senha hashada, se aplicável)
            $usuario->update($data);
            DB::commit(); // Confirma a transação

            // Retorna a confirmação de atualização do usuário
            return response()->json([
                'status' => true,
                'message' => 'Usuário atualizado com sucesso!',
                'usuario' => $usuario,
            ], 200); // Código 200 OK

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error('Erro ao atualizar usuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o usuário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    // Inativa um usuário (delete lógico) ao invés de removê-lo fisicamente
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            // Encontra o usuário pelo ID
            $usuario = Usuario::find($id);

            // Se o usuário não for encontrado ou já estiver inativo, retorna 404
            if (!$usuario || !$usuario->ativo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado ou já está inativo.',
                ], 404);
            }

            // Marca o usuário como inativo (delete lógico)
            $usuario->update(['ativo' => false]);
            DB::commit();

            // Retorna a confirmação de que o usuário foi inativado
            return response()->json([
                'status' => true,
                'message' => 'Usuário inativado com sucesso (delete lógico)!',
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao inativar usuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao inativar o usuário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
