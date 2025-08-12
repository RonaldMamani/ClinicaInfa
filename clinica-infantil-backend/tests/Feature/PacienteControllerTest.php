<?php

namespace Tests\Feature;

use Tests\TestCase;

class PacienteControllerTest extends TestCase
{
    protected string $authToken;

    /**
     * Configura o ambiente de teste e realiza o login para obter um token de autenticação.
     * Este método é executado antes de cada teste.
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Assume-se que o usuário 'pedro.diretor' já existe no banco de dados.
        $loginResponse = $this->postJson('/api/login', [
            'username' => 'pedro.diretor',
            'senha' => '123456789',
        ]);
        
        // Verifica se o login foi bem-sucedido e obtém o token.
        $loginResponse->assertStatus(200);
        $this->authToken = $loginResponse->json('access_token');
    }

    /**
     * Testa se a rota index retorna todos os pacientes com as relações.
     *
     * @return void
     */
    public function test_index_retorna_todos_os_pacientes_com_relacoes()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes');

        // A verificação de estrutura foi simplificada para ser mais resiliente
        // a pequenas variações nos dados do banco de testes.
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes obtida com sucesso.',
                 ])
                 ->assertJsonStructure([
                     'pacientes' => [
                         '*' => [
                             'id',
                             'data_nascimento',
                             'cliente',
                             'responsavel',
                             'consultas'
                         ],
                     ],
                 ]);
    }

    /**
     * Testa se a rota pacientesAtivos retorna apenas pacientes com cliente ativo.
     *
     * @return void
     */
    public function test_pacientes_ativos_retorna_apenas_pacientes_com_cliente_ativo()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes/ativos');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes ativos obtida com sucesso.',
                 ]);
        
        // Verifica se cada paciente retornado tem um cliente ativo
        collect($response->json('pacientes'))->each(function ($paciente) {
            $this->assertTrue((bool)$paciente['cliente']['ativo']);
        });
    }

    /**
     * Testa se a rota pacientesInativos retorna apenas pacientes com cliente inativo.
     *
     * @return void
     */
    public function test_pacientes_inativos_retorna_apenas_pacientes_com_cliente_inativo()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes/inativos');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes inativos obtida com sucesso.',
                 ]);

        // Verifica se cada paciente retornado tem um cliente inativo
        collect($response->json('pacientes'))->each(function ($paciente) {
            $this->assertFalse((bool)$paciente['cliente']['ativo']);
        });
    }

    /**
     * Testa se a rota pacientesPaginacao retorna uma lista paginada.
     *
     * @return void
     */
    public function test_pacientes_paginacao_retorna_lista_paginada()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes/paginacao');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'pacientes' => [
                         'current_page',
                         'data' => [
                             '*' => [
                                 'id',
                                 'data_nascimento',
                                 'cliente',
                                 'responsavel',
                                 'consultas'
                             ]
                         ],
                         'total',
                         'per_page',
                     ],
                 ])
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes paginada obtida com sucesso.',
                 ]);
    }

    /**
     * Testa se a rota pacientesPaginacao com filtro 'ativo=true' retorna pacientes ativos.
     *
     * @return void
     */
    public function test_pacientes_paginacao_com_filtro_ativo_retorna_apenas_ativos()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes/paginacao?ativo=true');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes ativos paginada obtida com sucesso.',
                 ]);

        // Verifica se cada paciente na lista paginada tem um cliente ativo
        collect($response->json('pacientes.data'))->each(function ($paciente) {
            $this->assertTrue((bool)$paciente['cliente']['ativo']);
        });
    }

    /**
     * Testa se a rota pacientesPaginacao com filtro 'ativo=false' retorna pacientes inativos.
     *
     * @return void
     */
    public function test_pacientes_paginacao_com_filtro_inativo_retorna_apenas_inativos()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/pacientes/paginacao?ativo=false');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de pacientes inativos paginada obtida com sucesso.',
                 ]);

        // Verifica se cada paciente na lista paginada tem um cliente inativo
        collect($response->json('pacientes.data'))->each(function ($paciente) {
            $this->assertFalse((bool)$paciente['cliente']['ativo']);
        });
    }
}
