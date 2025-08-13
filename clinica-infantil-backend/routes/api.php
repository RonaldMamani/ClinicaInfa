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
use App\Http\Controllers\Api\QuantidadeController;
use App\Http\Controllers\Api\ResponsavelController;
use App\Http\Controllers\Api\UsuarioController;
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
    Route::controller(CidadeController::class)->group(function () {
        Route::get('/cidades', 'index');
        Route::get('/estados/{estadoId}/cidades', 'getCidadesByEstado');
    });
    
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
    Route::controller(PerfilController::class)->group(function () {
        Route::get('/perfis', 'index');
        Route::get('/perfis/{perfil}', 'show');
    });
    
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
    Route::put('/usuarios/{id}/activate', [UsuarioController::class, 'reativarUsuario']);
    Route::put('/usuarios/{id}/redefinir', [UsuarioController::class, 'redefinirSenha']);
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
        Route::post('/pacientes', 'store');
        Route::put('/pacientes/{id}', 'update');
        Route::delete('/pacientes/{id}', 'destroy');
    });
    
    // Rotas para Médicos
    Route::get('/medicos', [MedicoController::class, 'index']);
    Route::get('/medicos/{id}', [MedicoController::class, 'show']);
    Route::post('/medicos', [MedicoController::class, 'store']);
    
    // Rotas para Consultas
    Route::controller(ConsultaController::class)->group(function () {
        // Métodos GET
        Route::get('/consultas', 'index');
        Route::get('/consultas/listar', 'consultasListar');
        Route::get('/consultas/agendadas', 'consultasAgendadas');
        Route::get('/consultas/listar-agendadas', 'consultasAgendadasListar');
        Route::get('/consultas/agendadas/{id}', 'showAgendada');
        Route::get('/consultas/medico', 'consultasMedico');
        Route::get('/consultas/medico/agendados', 'consultasMedicoAgendados');
        Route::get('/consultas/{id}', 'show');

        // Métodos POST
        Route::post('/consultas', 'store');
        Route::post('/consultas/medico/agendar', 'storeMedico');
        Route::post('/consultas/{id}/finalizar', 'finalizarConsulta');

        // Métodos PUT
        Route::put('/consultas/{id}', 'update');
        Route::put('/consultas/agendadas/{id}/remarcar', 'remarcar');
        Route::put('/consultas/{id}/concluir', 'concluir');

        // Métodos PATCH
        Route::patch('/consultas/{id}/status', 'updateStatus');
    });
    
    // Rotas para Prontuários
    Route::controller(ProntuarioController::class)->group(function () {
        Route::get('/prontuarios', 'index');
        Route::get('/prontuarios/paciente/{idPaciente}/check', 'checkProntuario');
        Route::get('/prontuarios/paciente/{idPaciente}', 'showByPacienteId');
        Route::get('/prontuarios/{prontuario}', 'show');
        Route::post('/prontuarios', 'store');
        Route::put('/prontuarios/{prontuario}', 'update');
        Route::patch('/prontuarios/{prontuario}', 'update');
        Route::delete('/prontuarios/{prontuario}', 'destroy');
    });
    
    // Rotas para Pagamentos
    Route::controller(PagamentoController::class)->group(function () {
        Route::get('/pagamentos', 'index');
        Route::get('/pagamentos/{pagamento}', 'show');
        Route::post('/pagamentos', 'store');
        Route::put('/pagamentos/{pagamento}', 'update');
        Route::delete('/pagamentos/{pagamento}', 'destroy');
    });

    Route::get('/estatisticas/todas-consultas', [EstatisticaController::class, 'todasConsultas']);
    Route::get('/estatisticas/pacientes-por-cidade', [EstatisticaController::class, 'pacientesPorCidade']);
    Route::get('/estatisticas/responsaveis-por-cidade', [EstatisticaController::class, 'responsaveisPorCidade']);
    Route::get('/estatisticas/receita-mensal', [EstatisticaController::class, 'receitaMensal']);
    Route::get('/estatisticas/consultas-por-especialidade', [EstatisticaController::class, 'consultasPorEspecialidade']);
    Route::get('/estatisticas/pacientes-por-genero', [EstatisticaController::class, 'pacientesPorGenero']);
    Route::get('/estatisticas/clientes-por-funcao', [EstatisticaController::class, 'clientesPorFuncao']);
    Route::get('/estatisticas/consultas-por-medico-por-mes', [EstatisticaController::class, 'consultasPorMedicoPorMes']);
    Route::get('/estatisticas/consultas-e-pacientes-mensal', [EstatisticaController::class, 'consultasEAtividadeDePacienteMensal']);

    Route::controller(QuantidadeController::class)->group(function () {
        Route::get('/quantidades/consultas/todas', 'quantidadeTodasConsultas');
        Route::get('/quantidades/consultas/agendadas', 'quantidadeConsultasAgendadas');
        Route::get('/quantidades/medico/consultas', 'quantidadeConsultasDoMedico');
        Route::get('/quantidades/medico/agendadas', 'quantidadeConsultasDoMedicoAgendada');
        Route::get('/quantidades/pacientes', 'quantidadePacientes');
    });
});