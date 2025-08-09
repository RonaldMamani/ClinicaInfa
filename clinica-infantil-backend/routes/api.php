<?php

use App\Http\Controllers\Api\CidadeController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\EstadoController;
use App\Http\Controllers\Api\EstatisticaController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\GeneroController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\MedicoController;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\PagamentoController;
use App\Http\Controllers\Api\PerfilController;
use App\Http\Controllers\Api\ProntuarioController;
use App\Http\Controllers\Api\ResponsavelController;
use App\Http\Controllers\Api\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas de Autenticação (não precisam de middleware de autenticação para login)
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Rota para o logout, que precisa de autenticação para revogar o token
    Route::post('/logout', [LoginController::class, 'logout']);

    // Rotas para Estados
    Route::get('/estados', [EstadoController::class, 'index']);
    Route::get('/estados/{estado}', [EstadoController::class, 'show']);
    
    // Rotas para Cidades
    Route::get('/cidades', [CidadeController::class, 'index']);
    Route::get('/estados/{estadoId}/cidades', [CidadeController::class, 'getCidadesByEstado']);
    
    // Rotas para Gêneros
    Route::get('/generos', [GeneroController::class, 'index']);
    Route::get('generos/get', [GeneroController::class, 'getGenero']);
    Route::get('/generos/{genero}', [GeneroController::class, 'show']);
    
    // Rotas para Clientes
    Route::controller(ClienteController::class)->group(function () {
        Route::get('/clientes', 'index');
        Route::get('/clientes/{id}', 'show');
        Route::post('/clientes', 'store');
    });
    
    // Rotas para Perfis
    Route::get('/perfis', [PerfilController::class, 'index']);
    Route::get('/perfis/{id}', [PerfilController::class, 'show']);
    
    
    // Rotas para Funcionários
    Route::get('/funcionarios', [FuncionarioController::class, 'index']);
    Route::get('/funcionarios/{id}', [FuncionarioController::class, 'show']);
    
    // Rotas para Usuários
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('usuarios/todos', [UsuarioController::class, 'getTodosUsuarios']);
    Route::get('usuarios/ativos', [UsuarioController::class, 'getUsuariosAtivos']);
    Route::get('usuarios/inativos', [UsuarioController::class, 'getUsuariosInativos']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::patch('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
    
    // Rotas para Responsáveis
    Route::get('/responsaveis', [ResponsavelController::class, 'index']);
    Route::get('responsaveis/listar', [ResponsavelController::class, 'responsaveisListar']);
    Route::get('responsaveis/ativos', [ResponsavelController::class, 'getActiveResponsaveis']);
    Route::get('responsaveis/inativos', [ResponsavelController::class, 'getInactiveResponsaveis']);
    Route::get('/responsaveis/page-ativos', [ResponsavelController::class, 'responsaveisAtivos']);
    Route::get('/responsaveis/page-inativos', [ResponsavelController::class, 'responsaveisInativos']);
    Route::get('/responsaveis/{id}', [ResponsavelController::class, 'show']);
    Route::put('responsaveis/{id}/status', [ResponsavelController::class, 'updateStatus']);
    Route::put('/responsaveis/{id}', [ResponsavelController::class, 'update']);
    Route::patch('/responsaveis/{id}', [ResponsavelController::class, 'update']);

    // Rotas para Pacientes
    Route::controller(PacienteController::class)->group(function () {
        Route::get('/pacientes', 'index');
        Route::get('/pacientes/contagem', 'contarPacientes');
        Route::get('/pacientes/paginacao', 'pacientesPaginacao');
        Route::get('/pacientes/ativos', 'pacientesAtivos');
        Route::get('/pacientes/inativos', 'pacientesInativos');
        Route::get('/pacientes/{id}', 'show');
        Route::put('/pacientes/{id}', 'update');
        Route::delete('/pacientes/{id}', 'destroy');
    });
    
    // Rotas para Médicos
    Route::get('medicos/consultas/count/total', [ConsultaController::class, 'countAllConsultas']);
    Route::get('medicos/consultas/count/agendadas', [ConsultaController::class, 'countAgendadasConsultas']);
    Route::get('/medicos', [MedicoController::class, 'index']);
    Route::get('/medicos/{id}', [MedicoController::class, 'show']);
    Route::post('/medicos', [MedicoController::class, 'store']);
    
    // Rotas para Consultas
    Route::get('/consultas/agendadas', [ConsultaController::class, 'consultasAgendadas']);//
    Route::get('/consultas/concluidas', [ConsultaController::class, 'consultasConcluidas']);//
    Route::get('/consultas/agendadas/{id}', [ConsultaController::class, 'showAgendada']); //
    Route::get('/consultas/quantidades/todas', [ConsultaController::class, 'quantidadeTotal']);//
    Route::get('/consultas/quantidades/agendadas', [ConsultaController::class, 'quantidadeAgendadas']);//
    Route::get('/consultas/estatisticas', [ConsultaController::class, 'todasAsEstatisticas']);
    Route::get('/consultas/medico', [ConsultaController::class, 'consultasMedico']);
    Route::get('/consultas/medico/agendados', [ConsultaController::class, 'consultasMedicoAgendados']);
    Route::get('/consultas/listar', [ConsultaController::class, 'consultasListar']); //
    Route::get('/consultas/listar-agendadas', [ConsultaController::class, 'consultasAgendadasListar']); //
    Route::get('/consultas', [ConsultaController::class, 'index']); //
    Route::get('/consultas/{id}', [ConsultaController::class, 'show']); //
    Route::post('/consultas/medico/agendar', [ConsultaController::class, 'storeMedico']);
    Route::post('/consultas', [ConsultaController::class, 'store']); //
    Route::put('/consultas/agendadas/{id}/remarcar', [ConsultaController::class, 'remarcar']); //
    Route::put('/consultas/{id}', [ConsultaController::class, 'update']); //
    Route::put('/consultas/{id}/concluir', [ConsultaController::class, 'concluir']);
    Route::post('/consultas/{id}/finalizar', [ConsultaController::class, 'finalizarConsulta']); //
    Route::patch('/consultas/{id}/status', [ConsultaController::class, 'updateStatus']);
    Route::delete('/consultas/{id}', [ConsultaController::class, 'destroy']);
    
    // Rotas para Prontuários
    Route::get('/prontuarios', [ProntuarioController::class, 'index']); //
    Route::get('/prontuarios/{id}', [ProntuarioController::class, 'show']); //
    Route::get('prontuarios/paciente/{idPaciente}/check', [ProntuarioController::class, 'checkProntuario']);
    Route::get('prontuarios/paciente/{idPaciente}', [ProntuarioController::class, 'showByPacienteId']);
    Route::post('/prontuarios', [ProntuarioController::class, 'storeMedico']);
    Route::put('/prontuarios/{id}', [ProntuarioController::class, 'update']); //
    
    // Rotas para Pagamentos
    Route::get('/pagamentos', [PagamentoController::class, 'index']);
    Route::get('/pagamentos/{id}', [PagamentoController::class, 'show']);
    Route::post('/pagamentos', [PagamentoController::class, 'store']);
    Route::put('/pagamentos/{id}', [PagamentoController::class, 'update']);
    Route::patch('/pagamentos/{id}', [PagamentoController::class, 'update']);

    Route::get('/estatisticas/pacientes-por-cidade', [EstatisticaController::class, 'pacientesPorCidade']);
    Route::get('/estatisticas/receita-mensal', [EstatisticaController::class, 'receitaMensal']);
});