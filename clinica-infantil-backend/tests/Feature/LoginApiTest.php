<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginApiTest extends TestCase
{
    // Usa o RefreshDatabase para garantir um banco de dados limpo para cada teste.
    use RefreshDatabase;

    /**
     * Testa o login de um usuário com credenciais válidas.
     *
     * @return void
     */
    public function test_login_com_credenciais_validas(): void
    {
        // 1. Preparar o ambiente:
        // Crie um usuário de teste no banco de dados.
        // Usamos Hash::make para criptografar a senha, assim como o seu controller faz.
        $usuario = Usuario::factory()->create([
            'username' => 'pedro.diretor',
            'senha' => Hash::make('123456'),
            'ativo' => true,
        ]);

        // 2. Executar a ação:
        // Simula uma requisição POST para a rota de login com as credenciais.
        $response = $this->postJson('/api/login', [
            'username' => 'pedro.diretor',
            'senha' => '123456',
        ]);

        // 3. Verificar o resultado:
        // Afirma que o status da resposta HTTP é 200 (OK).
        $response->assertStatus(200);

        // Afirma que a resposta JSON tem a estrutura esperada.
        $response->assertJsonStructure([
            'status',
            'message',
            'access_token',
            'token_type',
            'usuario' => [
                'id',
                'username',
            ],
        ]);
        
        // Afirma que o status da resposta é 'true'.
        $response->assertJson(['status' => true]);
    }
}
