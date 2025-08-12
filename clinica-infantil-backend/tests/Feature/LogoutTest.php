<?php

namespace Tests\Feature;

use Tests\TestCase;

class LogoutTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_logout_com_token_valido()
    {
        // 1. Faz o login para obter um token de autenticação válido.
        //    As credenciais do usuário "pedro.diretor" são usadas.
        $loginResponse = $this->postJson('/api/login', [
            'username' => 'pedro.diretor',
            'senha' => '123456789',
        ]);

        // Verifica se o login foi bem-sucedido e obtém o token.
        $loginResponse->assertStatus(200);
        $token = $loginResponse->json('access_token');
        
        // 2. Faz a requisição POST para a rota de logout com o token no header de autorização.
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        // 3. Verifica se a resposta foi bem-sucedida (código 200).
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Logout realizado com sucesso. Token revogado.',
                 ]);
    }

    /**
     * Testa uma tentativa de logout sem um token de autenticação.
     *
     * @return void
     */
    public function test_logout_sem_autenticacao()
    {
        // 1. Faz a requisição POST para a rota de logout sem nenhum header de autorização.
        $response = $this->postJson('/api/logout');

        // 2. Verifica se a resposta é de não autorizado (código 401),
        //    pois a rota está protegida pelo middleware 'auth:sanctum'.
        $response->assertStatus(401);
    }
}
