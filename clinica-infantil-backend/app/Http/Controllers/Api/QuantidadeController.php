<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\Medico;
use App\Models\Paciente;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class QuantidadeController extends Controller
{
    /**
     * Retorna a quantidade total de consultas.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function quantidadeTodasConsultas()
    {
        $total = Consulta::count();
        return response()->json([
            'status' => true,
            'message' => 'Quantidade total de consultas obtida com sucesso.',
            'quantidade_total' => $total,
        ], 200);
    }

    /**
     * Retorna a quantidade de consultas com o status "agendada".
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function quantidadeConsultasAgendadas()
    {
        $agendadas = Consulta::whereIn('status', ['agendada', 'concluidas' , 'Agendada'])->count();
        return response()->json([
            'status' => true,
            'message' => 'Quantidade de consultas agendadas obtida com sucesso.',
            'quantidade' => $agendadas,
        ], 200);
    }

    /**
     * Retorna a contagem de todas as consultas do médico autenticado.
     *
     * @return JsonResponse
     */
    public function quantidadeConsultasDoMedico(): JsonResponse
    {
        try {
            $medicoId = Medico::where('id_usuario', Auth::id())->first()->id;
            $count = Consulta::where('id_medico', $medicoId)->count();

            return response()->json([
                'status' => true,
                'total_consultas' => $count,
                'message' => 'Contagem de consultas totais obtida com sucesso.'
            ]);
        } catch (Exception $e) {
            Log::error('Erro ao contar consultas totais: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao obter a contagem de consultas totais.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a contagem de consultas agendadas do médico autenticado.
     *
     * @return JsonResponse
     */
    public function quantidadeConsultasDoMedicoAgendada(): JsonResponse
    {
        try {
            $medicoId = Medico::where('id_usuario', Auth::id())->first()->id;
            $count = Consulta::where('id_medico', $medicoId)
                ->where('status', 'agendada')
                ->count();

            return response()->json([
                'status' => true,
                'consultas_agendadas' => $count,
                'message' => 'Contagem de consultas agendadas obtida com sucesso.'
            ]);
        } catch (Exception $e) {
            Log::error('Erro ao contar consultas agendadas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao obter a contagem de consultas agendadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a quantidade total de pacientes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function quantidadePacientes()
    {
        try {
            $ativos = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', true);
            })->count();
            
            $inativos = Paciente::whereHas('cliente', function ($query) {
                $query->where('ativo', false);
            })->count();

            return response()->json([
                'status' => true,
                'message' => 'Contagem de pacientes ativos e inativos realizada com sucesso.',
                'dados' => [
                    'ativos' => $ativos,
                    'inativos' => $inativos
                ]
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao contar pacientes: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao contar os pacientes. Verifique os logs do servidor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
