<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Pagamento;
use App\Models\Responsavel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstatisticaController extends Controller
{
    public function pacientesPorCidade()
    {
        // Junta as tabelas de Paciente, Cliente e Cidade para contar os pacientes por cidade
        $pacientesPorCidade = Paciente::join('clientes', 'pacientes.id_cliente', '=', 'clientes.id')
            ->join('cidades', 'clientes.id_cidade', '=', 'cidades.id')
            ->select('cidades.nome_cidade', DB::raw('count(pacientes.id) as total_pacientes'))
            ->groupBy('cidades.nome_cidade')
            ->orderByDesc('total_pacientes')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de pacientes por cidade obtida com sucesso.',
            'dados' => $pacientesPorCidade,
        ], 200);
    }

    public function responsaveisPorCidade()
    {
        // Junta as tabelas de Paciente, Cliente e Cidade para contar os pacientes por cidade
        $responsaveisPorCidade = Responsavel::join('clientes', 'responsaveis.id_cliente', '=', 'clientes.id')
            ->join('cidades', 'clientes.id_cidade', '=', 'cidades.id')
            ->select('cidades.nome_cidade', DB::raw('count(responsaveis.id) as total_responsaveis'))
            ->groupBy('cidades.nome_cidade')
            ->orderByDesc('total_responsaveis')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de pacientes por cidade obtida com sucesso.',
            'dados' => $responsaveisPorCidade,
        ], 200);
    }

    public function receitaMensal()
    {
        $receitaPorMes = Pagamento::select(
                DB::raw('DATE_FORMAT(data_pagamento, "%Y-%m") as mes'),
                DB::raw('SUM(valor) as total_receita')
            )
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Receita mensal obtida com sucesso.',
            'dados' => $receitaPorMes,
        ], 200);
    }

    public function consultasPorEspecialidade()
    {
        $consultasPorEspecialidade = Consulta::join('medicos', 'consultas.id_medico', '=', 'medicos.id')
            ->select('medicos.especialidade', DB::raw('count(consultas.id) as total_consultas'))
            ->groupBy('medicos.especialidade')
            ->orderByDesc('total_consultas')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de consultas por especialidade obtida com sucesso.',
            'dados' => $consultasPorEspecialidade,
        ], 200);
    }

    public function pacientesPorGenero()
    {
        $pacientesPorGenero = Paciente::join('clientes', 'pacientes.id_cliente', '=', 'clientes.id')
            ->join('generos', 'clientes.id_genero', '=', 'generos.id')
            ->select('generos.genero', DB::raw('count(pacientes.id) as total_pacientes'))
            ->where('clientes.ativo', true)
            ->groupBy('generos.genero')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de pacientes ativos por gênero obtida com sucesso.',
            'dados' => $pacientesPorGenero,
        ], 200);
    }

    public function clientesPorFuncao()
    {
        // Contagem de clientes ativos
        $totalClientesAtivos = Cliente::where('ativo', true)->count();
        
        // Contagem de pacientes com clientes ativos
        $totalPacientesAtivos = Paciente::whereHas('cliente', function ($query) {
            $query->where('ativo', true);
        })->count();
        
        // Contagem de responsáveis com clientes ativos
        $totalResponsaveisAtivos = Responsavel::whereHas('cliente', function ($query) {
            $query->where('ativo', true);
        })->count();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de clientes, pacientes e responsáveis ativos obtida com sucesso.',
            'dados' => [
                'total_clientes' => $totalClientesAtivos,
                'total_pacientes' => $totalPacientesAtivos,
                'total_responsaveis' => $totalResponsaveisAtivos,
            ],
        ], 200);
    }

    public function consultasPorMedicoPorMes()
    {
        $consultasPorMedico = Consulta::join('medicos', 'consultas.id_medico', '=', 'medicos.id')
            ->join('usuarios', 'medicos.id_usuario', '=', 'usuarios.id')
            ->join('funcionarios', 'usuarios.id_funcionario', '=', 'funcionarios.id')
            ->select(
                'funcionarios.nome',
                DB::raw('DATE_FORMAT(consultas.data_consulta, "%Y-%m") as mes'),
                DB::raw('count(consultas.id) as total_consultas')
            )
            ->groupBy('funcionarios.nome', 'mes')
            ->orderBy('mes')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de consultas por médico por mês obtida com sucesso.',
            'dados' => $consultasPorMedico,
        ], 200);
    }

    public function consultasEAtividadeDePacienteMensal()
    {
        $dadosMensais = Consulta::join('pacientes', 'consultas.id_paciente', '=', 'pacientes.id')
            ->join('clientes', 'pacientes.id_cliente', '=', 'clientes.id')
            ->where('clientes.ativo', true)
            ->select(
                DB::raw('DATE_FORMAT(consultas.data_consulta, "%Y-%m") as mes'),
                DB::raw('COUNT(consultas.id) as total_consultas'),
                DB::raw('COUNT(DISTINCT consultas.id_paciente) as total_pacientes_unicos')
            )
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Contagem de consultas e pacientes por mês obtida com sucesso.',
            'dados' => $dadosMensais,
        ], 200);
    }
}