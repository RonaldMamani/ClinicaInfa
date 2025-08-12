<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RedefinirSenhaRequest;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Models\Funcionario;
use App\Models\Medico;
use App\Models\Perfil;
use App\Models\Usuario;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    protected $relations = ['perfil', 'funcionario', 'medico'];

    public function index()
    {
        try {
            // Busca apenas usuários ATIVOS, carregando os dados relacionados de perfil e funcionário
            // Ordena os resultados pelo username em ordem ascendente
            $usuarios = Usuario::with(['perfil', 'funcionario'])
                                ->where('ativo', true) // Adicionado: Filtra apenas usuários ativos
                                ->orderBy('id', 'ASC')
                                ->get();

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

    public function getTodosUsuarios(): JsonResponse
    {
        try {
            $usuariosAtivos = Usuario::where('ativo', true)
                                     ->with($this->relations)
                                     ->get();

            $usuariosInativos = Usuario::where('ativo', false)
                                       ->with($this->relations)
                                       ->get();

            return response()->json([
                'status' => true,
                'message' => 'Todos os usuários listados com sucesso.',
                'usuarios_ativos' => $usuariosAtivos,
                'usuarios_inativos' => $usuariosInativos,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao listar todos os usuários (index): ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar todos os usuários.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsuariosAtivos(): JsonResponse
    {
        try {
            $usuarios = Usuario::where('ativo', true)
                               ->with($this->relations)
                               ->get();

            return response()->json([
                'status' => true,
                'message' => 'Usuários ativos listados com sucesso.',
                'usuarios' => $usuarios,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao listar usuários ativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os usuários ativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsuariosInativos(): JsonResponse
    {
        try {
            $usuarios = Usuario::where('ativo', false)
                               ->with($this->relations)
                               ->get();

            return response()->json([
                'status' => true,
                'message' => 'Usuários inativos listados com sucesso.',
                'usuarios' => $usuarios,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao listar usuários inativos: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar os usuários inativos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $usuario = Usuario::with($this->relations)->find($id);

            if (!$usuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do usuário carregados com sucesso.',
                'usuario' => $usuario,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao exibir usuário: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o usuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreUsuarioRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // 1. Cria o registro de Funcionário
            $funcionarioData = $request->input('funcionario');
            $funcionario = Funcionario::create($funcionarioData);

            // 2. Cria o registro de Usuário
            $usuarioData = $request->only(['username', 'id_perfil', 'ativo']);
            $usuarioData['id_funcionario'] = $funcionario->id;
            $usuarioData['senha'] = Hash::make($request->input('senha'));

            $usuario = Usuario::create($usuarioData);

            // 3. Verifica se o perfil é 'Medico' e cria o registro de Medico
            $perfilMedico = Perfil::where('nome_perfil', 'Medico')->first();

            // Correção: usa a comparação não estrita (==) para evitar erro de tipo.
            // O request envia 'id_perfil' como string, mas o objeto $perfilMedico->id é um inteiro.
            if ($perfilMedico && $usuario->id_perfil == $perfilMedico->id && $request->has('medico')) {
                $medicoData = $request->input('medico');
                $medicoData['id_usuario'] = $usuario->id;
                Medico::create($medicoData);
            }

            DB::commit();

            $usuario->load($this->relations);

            return response()->json([
                'status' => true,
                'message' => 'Usuário criado com sucesso.',
                'usuario' => $usuario
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Erro ao criar usuário: " . $e->getMessage());
            
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o usuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateUsuarioRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $usuario = Usuario::with($this->relations)->find($id);

            if (!$usuario) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado.'
                ], 404);
            }

            // Atualiza os dados do modelo Usuario
            $usuario->update($request->only(['username', 'id_perfil', 'id_funcionario', 'ativo']));

            // Atualiza os dados do Funcionário associado, se estiverem presentes no request
            if ($request->has('funcionario') && $usuario->funcionario) {
                $usuario->funcionario->update($request->input('funcionario'));
            }

            // Atualiza ou cria o registro de Médico se o perfil for de Médico
            $perfilMedico = Perfil::where('nome_perfil', 'Medico')->first();

            if ($request->has('medico')) {
                if ($perfilMedico && $usuario->id_perfil === $perfilMedico->id) {
                    $medicoData = $request->input('medico');
                    $medico = Medico::firstOrNew(['id_usuario' => $usuario->id]);
                    $medico->fill($medicoData);
                    $medico->save();
                } else if ($usuario->medico) {
                    // Se o perfil mudou e não é mais Médico, deleta o registro de médico
                    $usuario->medico->delete();
                }
            }
            
            DB::commit(); // Confirma a transação

            // Recarrega o usuário com as relações atualizadas para a resposta
            $usuario->refresh()->load($this->relations);

            return response()->json([
                'status' => true,
                'message' => 'Usuário atualizado com sucesso.',
                'usuario' => $usuario
            ], 200);

        } catch (Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            Log::error("Erro ao atualizar usuário: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o usuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function redefinirSenha(RedefinirSenhaRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $usuario = Usuario::find($id);

            if (!$usuario) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado.'
                ], 404);
            }

            // Hashea a nova senha
            $newPassword = Hash::make($request->input('senha'));

            // Atualiza a senha no banco de dados
            $usuario->update(['senha' => $newPassword]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Senha redefinida com sucesso!'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao redefinir a senha do usuário: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao redefinir a senha.',
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

    public function reativarUsuario($id)
    {
        DB::beginTransaction();
        try {
            // Encontra o usuário pelo ID
            $usuario = Usuario::find($id);

            // Se o usuário não for encontrado ou já estiver ativo, retorna 404
            if (!$usuario || $usuario->ativo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuário não encontrado ou já está ativo.',
                ], 404);
            }

            // Marca o usuário como ativo
            $usuario->update(['ativo' => true]);
            DB::commit();

            // Retorna a confirmação de que o usuário foi reativado
            return response()->json([
                'status' => true,
                'message' => 'Usuário reativado com sucesso!',
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao reativar usuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao reativar o usuário. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
