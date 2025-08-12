<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Usuario;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();
            
            // 1. Busca o usuário pelo username
            $usuario = Usuario::where('username', $credentials['username'])->first();

            // 2. Verifica se o usuário existe, se a senha está correta e se está ativo
            if (!$usuario || !Hash::check($credentials['senha'], $usuario->senha) || !$usuario->ativo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Credenciais inválidas ou usuário inativo.',
                ], 401);
            }
            
            // 3. Revoga todos os tokens existentes para este usuário para maior segurança
            $usuario->tokens()->delete();

            // 4. Cria um novo token para o usuário
            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Login realizado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'usuario' => $usuario->load('perfil', 'funcionario'),
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro no login: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro no processo de login. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Tenta obter o usuário autenticado via Sanctum
            $user = $request->user();
            if ($user) {
                $user->currentAccessToken()->delete();
                return response()->json([
                    'status' => true,
                    'message' => 'Logout realizado com sucesso. Token revogado.',
                ], 200);
            }
            
            return response()->json([
                'status' => false,
                'message' => 'Nenhum usuário autenticado para realizar o logout.',
            ], 401);

        } catch (Exception $e) {
            Log::error('Erro no logout: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao realizar o logout. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
