<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Usuario;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            // Busca o usuário pelo username
            $usuario = Usuario::where('username', $credentials['username'])->first();

            // Verifica se o usuário existe e se a senha está correta
            // E também verifica se o usuário está ativo (delete lógico)
            if (!$usuario || !Hash::check($credentials['senha'], $usuario->senha) || !$usuario->ativo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Credenciais inválidas ou usuário inativo.',
                ], 401); // Código 401 Unauthorized
            }

            // Revoga todos os tokens existentes para este usuário (opcional, para segurança)
            // $usuario->tokens()->delete();

            // Cria um novo token para o usuário
            // 'auth_token' é o nome do token, pode ser qualquer string descritiva
            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Login realizado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'usuario' => $usuario, // Opcional: retorna dados do usuário (sem a senha)
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
}
