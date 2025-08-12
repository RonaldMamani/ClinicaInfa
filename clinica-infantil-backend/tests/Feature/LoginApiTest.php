<?php

namespace Tests\Feature;

use Tests\TestCase;

class LoginApiTest extends TestCase
{
    /**
     * Testa o login de um usuário com credenciais válidas.
     *
     * @return void
     */
    public function test_login_com_credenciais_validas()
    {
        // 1. As credenciais do usuário "pedro.diretor" são usadas diretamente.
        //    A senha "123456789" é a senha de texto simples para a requisição.
        $response = $this->postJson('/api/login', [
            'username' => 'pedro.diretor',
            'senha' => '123456789',
        ]);

        // 2. Verifica se a resposta foi bem-sucedida (código 200) e o JSON esperado.
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'access_token',
                     'token_type',
                     'usuario' => [
                         'id',
                         'username',
                         'id_perfil',
                         'id_funcionario',
                         // ... adicione outros campos da estrutura do usuário se necessário
                     ]
                 ])
                 ->assertJson([
                     'status' => true,
                     'message' => 'Login realizado com sucesso!',
                 ]);
    }
}
