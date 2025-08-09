<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use App\Models\Pagamento;
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
}
