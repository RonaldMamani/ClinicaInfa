<?php

use App\Http\Controllers\Api\CidadeController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\EstadoController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\GeneroController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\MedicoController;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\PagamentoController;
use App\Http\Controllers\Api\PerfilController;
use App\Http\Controllers\Api\ProntuarioMedicoController;
use App\Http\Controllers\Api\ResponsavelController;
use App\Http\Controllers\Api\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas de Autenticação (não precisam de middleware de autenticação para login)
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/generos', [GeneroController::class, 'index']);
});

// Rotas para Estados
Route::get('/estados', [EstadoController::class, 'index']);
Route::get('/estados/{estado}', [EstadoController::class, 'show']);

// Rotas para Cidades
Route::get('/cidades', [CidadeController::class, 'index']);
Route::get('/cidades/{cidade}', [CidadeController::class, 'show']);
Route::get('/estados/{estadoId}/cidades', [CidadeController::class, 'getCidadesByEstado']);

// Rotas para Gêneros
//Route::get('/generos', [GeneroController::class, 'index']);
Route::get('/generos/{genero}', [GeneroController::class, 'show']);

// Rotas para Clientes
Route::get('/clientes', [ClienteController::class, 'index']); // GET para listar todos os clientes ATIVOS
Route::get('/clientes/inativos', [ClienteController::class, 'getInactiveClients']); // GET para listar clientes INATIVOS
Route::get('/clientes/{id}', [ClienteController::class, 'show']); // GET para mostrar um cliente por ID (se ATIVO)
Route::post('/clientes', [ClienteController::class, 'store']); // POST para criar um novo cliente
Route::put('/clientes/{id}', [ClienteController::class, 'update']); // PUT para atualizar um cliente
Route::patch('/clientes/{id}', [ClienteController::class, 'update']); // PATCH para atualizar um cliente
Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

// Rotas para Perfis
Route::get('/perfis', [PerfilController::class, 'index']);
Route::get('/perfis/{id}', [PerfilController::class, 'show']);
Route::post('/perfis', [PerfilController::class, 'store']);
Route::put('/perfis/{id}', [PerfilController::class, 'update']); // PUT para atualizar um perfil (substituição completa)
Route::patch('/perfis/{id}', [PerfilController::class, 'update']); // PATCH para atualizar um perfil (atualização parcial)
Route::delete('/perfis/{id}', [PerfilController::class, 'destroy']); // DELETE para remover um perfil

// Rotas para Funcionários
Route::get('/funcionarios', [FuncionarioController::class, 'index']);
Route::get('/funcionarios/{id}', [FuncionarioController::class, 'show']);
Route::post('/funcionarios', [FuncionarioController::class, 'store']);
Route::put('/funcionarios/{id}', [FuncionarioController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/funcionarios/{id}', [FuncionarioController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/funcionarios/{id}', [FuncionarioController::class, 'destroy']); // DELETE para remover

// Rotas para Usuários
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/usuarios/{id}', [UsuarioController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']); // DELETE para remover

// Rotas para Responsáveis
Route::get('/responsaveis', [ResponsavelController::class, 'index']);
Route::get('/responsaveis/{id}', [ResponsavelController::class, 'show']);
Route::post('/responsaveis', [ResponsavelController::class, 'store']);
Route::put('/responsaveis/{id}', [ResponsavelController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/responsaveis/{id}', [ResponsavelController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/responsaveis/{id}', [ResponsavelController::class, 'destroy']); // DELETE para remover (físico)

// Rotas para Pacientes
Route::get('/pacientes', [PacienteController::class, 'index']); // GET para listar todos
Route::get('/pacientes/{id}', [PacienteController::class, 'show']); // GET para mostrar por ID
Route::post('/pacientes', [PacienteController::class, 'store']); // POST para criar
Route::put('/pacientes/{id}', [PacienteController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/pacientes/{id}', [PacienteController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']); // DELETE para remover (físico)

// Rotas para Médicos
Route::get('/medicos', [MedicoController::class, 'index']); // GET para listar todos
Route::get('/medicos/{id}', [MedicoController::class, 'show']); // GET para mostrar por ID
Route::post('/medicos', [MedicoController::class, 'store']); // POST para criar
Route::put('/medicos/{id}', [MedicoController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/medicos/{id}', [MedicoController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/medicos/{id}', [MedicoController::class, 'destroy']); // DELETE para remover (físico)

// Rotas para Consultas
Route::get('/consultas', [ConsultaController::class, 'index']); // GET para listar todos
Route::get('/consultas/{id}', [ConsultaController::class, 'show']); // GET para mostrar por ID
Route::post('/consultas', [ConsultaController::class, 'store']); // POST para criar
Route::put('/consultas/{id}', [ConsultaController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/consultas/{id}', [ConsultaController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/consultas/{id}', [ConsultaController::class, 'destroy']); // DELETE para remover (físico)

// Rotas para Prontuários Médicos
Route::get('/prontuarios-medicos', [ProntuarioMedicoController::class, 'index']); // GET para listar todos
Route::get('/prontuarios-medicos/{id}', [ProntuarioMedicoController::class, 'show']); // GET para mostrar por ID
Route::post('/prontuarios-medicos', [ProntuarioMedicoController::class, 'store']); // POST para criar
Route::put('/prontuarios-medicos/{id}', [ProntuarioMedicoController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/prontuarios-medicos/{id}', [ProntuarioMedicoController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/prontuarios-medicos/{id}', [ProntuarioMedicoController::class, 'destroy']); // DELETE para remover (físico)

// Rotas para Pagamentos
Route::get('/pagamentos', [PagamentoController::class, 'index']); // GET para listar todos
Route::get('/pagamentos/{id}', [PagamentoController::class, 'show']); // GET para mostrar por ID
Route::post('/pagamentos', [PagamentoController::class, 'store']); // POST para criar
Route::put('/pagamentos/{id}', [PagamentoController::class, 'update']); // PUT para atualizar (completo)
Route::patch('/pagamentos/{id}', [PagamentoController::class, 'update']); // PATCH para atualizar (parcial)
Route::delete('/pagamentos/{id}', [PagamentoController::class, 'destroy']); // DELETE para remover (físico)