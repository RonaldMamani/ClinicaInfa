<?php

namespace Tests\Feature;

use Tests\TestCase;

class ConsultaControllerTest extends TestCase
{
    /**
     * Um token de autenticação que será usado nos testes.
     * @var string
     */
    protected string $authToken;

    /**
     * Configura o ambiente de teste e realiza o login para obter um token de autenticação.
     * Este método é executado antes de cada teste.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 1. Faz o login para obter um token de autenticação válido.
        $loginResponse = $this->postJson('/api/login', [
            'username' => 'pedro.diretor',
            'senha' => '123456789',
        ]);

        // Verifica se o login foi bem-sucedido e obtém o token.
        $loginResponse->assertStatus(200);
        $this->authToken = $loginResponse->json('access_token');
    }

    /**
     * Testa a rota index, que retorna todas as consultas sem paginação.
     *
     * @return void
     */
    public function test_index_retorna_todas_as_consultas()
    {
        // 2. Faz a requisição GET para a rota /api/consultas com o token no header.
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/consultas');

        // 3. Verifica se a resposta foi bem-sucedida (código 200).
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'consultas' => [
                         '*' => [
                             'id',
                             'data_consulta',
                             'hora_inicio',
                             'hora_fim',
                             'status',
                             'paciente' => [
                                 'id',
                                 'cliente' => [
                                     'nome'
                                 ],
                             ],
                             'medico' => [
                                 'id',
                                 'usuario' => [
                                     'funcionario' => [
                                         'nome'
                                     ]
                                 ],
                             ],
                         ],
                     ],
                 ])
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de consultas obtida com sucesso.',
                 ]);
    }

    /**
     * Testa a rota consultasListar, que retorna as consultas paginadas.
     *
     * @return void
     */
    public function test_consultas_listar_retorna_consultas_paginadas()
    {
        // 1. Faz a requisição GET para a rota /api/consultas/listar com o token no header.
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
        ])->getJson('/api/consultas/listar');

        // 2. Verifica se a resposta foi bem-sucedida (código 200).
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'consultas' => [
                         'current_page',
                         'data' => [
                             '*' => [
                                 'id',
                                 'data_consulta',
                                 'hora_inicio',
                                 'hora_fim',
                                 'status',
                                 'paciente' => [
                                     'id',
                                     'cliente' => [
                                         'nome'
                                     ],
                                 ],
                                 'medico' => [
                                     'id',
                                     'usuario' => [
                                         'funcionario' => [
                                             'nome'
                                         ]
                                     ],
                                 ],
                             ],
                         ],
                         'first_page_url',
                         'from',
                         'last_page',
                         'last_page_url',
                         'path',
                         'per_page',
                         'to',
                         'total',
                     ],
                 ])
                 ->assertJson([
                     'status' => true,
                     'message' => 'Lista de consultas paginada obtida com sucesso.',
                 ]);
    }
}
