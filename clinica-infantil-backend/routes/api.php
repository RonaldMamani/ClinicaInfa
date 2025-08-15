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
    Route::controller(EstadoController::class)->group(function () {
        Route::get('/estados', 'index');
        Route::get('/estados/{estado}', 'show');
    });
    
    // Rotas para Cidades
    Route::controller(CidadeController::class)->group(function () {
        Route::get('/cidades', 'index');
        Route::get('/estados/{estadoId}/cidades', 'getCidadesByEstado');
    });
    
    // Rotas para Gêneros
    Route::controller(GeneroController::class)->group(function () {
        Route::get('/generos', 'index');
        Route::get('generos/get', 'getGenero');
        Route::get('/generos/{genero}', 'show');
    });
    
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
    Route::controller(FuncionarioController::class)->group(function () {
        Route::get('/funcionarios', 'index');
        Route::get('/funcionarios/{id}', 'show');
    });
    
    // Rotas para Usuários
    Route::controller(UsuarioController::class)->group(function () {
        Route::get('/usuarios', 'index');
        Route::get('usuarios/todos', 'getTodosUsuarios');
        Route::get('usuarios/ativos', 'getUsuariosAtivos');
        Route::get('usuarios/inativos', 'getUsuariosInativos');
        Route::get('/usuarios/{id}', 'show');
        Route::post('/usuarios', 'store');
        Route::put('/usuarios/{id}', 'update');
        Route::put('/usuarios/{id}/activate', 'reativarUsuario');
        Route::put('/usuarios/{id}/redefinir', 'redefinirSenha');
        Route::patch('/usuarios/{id}', 'update');
        Route::delete('/usuarios/{id}', 'destroy');
    });
    
    // Rotas para Responsáveis
    Route::controller(ResponsavelController::class)->group(function () {
        Route::get('/responsaveis', 'index');
        Route::get('responsaveis/listar', 'responsaveisListar');
        Route::get('responsaveis/ativos', 'getActiveResponsaveis');
        Route::get('responsaveis/inativos', 'getInactiveResponsaveis');
        Route::get('/responsaveis/page-ativos', 'responsaveisAtivos');
        Route::get('/responsaveis/page-inativos', 'responsaveisInativos');
        Route::get('/responsaveis/{id}', 'show');
        Route::put('responsaveis/{id}/status', 'updateStatus');
        Route::put('/responsaveis/{id}', 'update');
        Route::patch('/responsaveis/{id}', 'update');
    });

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
    Route::controller(MedicoController::class)->group(function () {
        Route::get('/medicos', 'index');
        Route::get('/medicos/{id}', 'show');
        Route::post('/medicos', 'store');
    });
    
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

        Route::delete('/consultas/{id}', 'destroy');
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

    // Rotas de Estatisticas
    Route::controller(EstatisticaController::class)->group(function () {
        Route::get('/estatisticas/todas-consultas', 'todasConsultas');
        Route::get('/estatisticas/pacientes-por-cidade', 'pacientesPorCidade');
        Route::get('/estatisticas/responsaveis-por-cidade', 'responsaveisPorCidade');
        Route::get('/estatisticas/receita-mensal', 'receitaMensal');
        Route::get('/estatisticas/consultas-por-especialidade', 'consultasPorEspecialidade');
        Route::get('/estatisticas/pacientes-por-genero', 'pacientesPorGenero');
        Route::get('/estatisticas/clientes-por-funcao', 'clientesPorFuncao');
        Route::get('/estatisticas/consultas-por-medico-por-mes', 'consultasPorMedicoPorMes');
        Route::get('/estatisticas/consultas-e-pacientes-mensal', 'consultasEAtividadeDePacienteMensal');
    });

    //Rotas de Quantidades e Contagem
    Route::controller(QuantidadeController::class)->group(function () {
        Route::get('/quantidades/consultas/todas', 'quantidadeTodasConsultas');
        Route::get('/quantidades/consultas/agendadas', 'quantidadeConsultasAgendadas');
        Route::get('/quantidades/medico/consultas', 'quantidadeConsultasDoMedico');
        Route::get('/quantidades/medico/agendadas', 'quantidadeConsultasDoMedicoAgendada');
        Route::get('/quantidades/pacientes', 'quantidadePacientes');
    });
});