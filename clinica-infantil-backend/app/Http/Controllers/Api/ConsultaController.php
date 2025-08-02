<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConsultaRequest;
use App\Http\Requests\RemarcarConsultaRequest;
use App\Models\Consulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ConsultaController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados para os métodos.
     * Incluído 'paciente.cliente', 'medico.usuario.perfil' e 'medico.usuario.funcionario'.
     */
    protected $relations = [
        'paciente.cliente',
        'paciente.responsavel',
        'paciente.responsavel.cliente',
        'paciente.cliente.genero',
        'medico',
        'medico.usuario.perfil', 
        'medico.usuario.funcionario',
    ];

    /**
     * Lista todas as consultas com os relacionamentos aninhados completos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $consultas = Consulta::with($this->relations)->get();

            return response()->json([
                'status' => true,
                'message' => 'Lista de consultas obtida com sucesso.',
                'consultas' => $consultas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar consultas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria uma nova consulta.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ConsultaRequest $request)
    {
        try {
            // O código de validação foi movido para o ConsultaRequest.
            // Aqui, usamos apenas os dados já validados.
            $consulta = Consulta::create($request->validated());

            // Carrega os relacionamentos aninhados para o retorno.
            return response()->json([
                'status' => true,
                'message' => 'Consulta criada com sucesso.',
                'consulta' => $consulta->load($this->relations),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar consulta: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe uma consulta específica.
     *
     * @param  \App\Models\Consulta  $consulta
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Tenta encontrar a consulta pelo ID e carrega os relacionamentos
        $consulta = Consulta::with($this->relations)->find($id);

        // Se a consulta não for encontrada, retorna um erro 404
        if (!$consulta) {
            return response()->json([
                'status' => false,
                'message' => 'Consulta não encontrada.'
            ], 404);
        }

        // Se a consulta for encontrada, retorna os dados
        return response()->json([
            'status' => true,
            'message' => 'Consulta obtida com sucesso.',
            'consulta' => $consulta,
        ], 200);
    }

    /**
     * Atualiza uma consulta existente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Consulta  $consulta
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Consulta $consulta)
    {
        // Validação dos dados
        $validator = Validator::make($request->all(), [
            'id_medico' => 'sometimes|exists:medicos,id',
            'id_paciente' => 'sometimes|exists:pacientes,id',
            'data_hora' => 'sometimes|date',
            'status' => 'sometimes|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erro de validação.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $consulta->update($request->all());
            // Carrega os relacionamentos aninhados para o retorno
            return response()->json([
                'status' => true,
                'message' => 'Consulta atualizada com sucesso.',
                'consulta' => $consulta->load($this->relations),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar consulta: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function remarcar(RemarcarConsultaRequest $request, $id)
    {
        // A validação agora é feita automaticamente pelo Form Request.
        
        // Procura a consulta pelo ID
        $consulta = Consulta::find($id);

        if (!$consulta) {
            return response()->json([
                'status' => false,
                'message' => 'Consulta não encontrada.'
            ], 404);
        }

        // Lógica para atualizar a consulta
        $consulta->data_consulta = $request->input('data_consulta');
        $consulta->hora_inicio = $request->input('hora_inicio');
        $consulta->hora_fim = $request->input('hora_fim');

        // Salva as alterações no banco de dados
        $consulta->save();

        // Retorna uma resposta de sucesso
        return response()->json([
            'status' => true,
            'message' => 'Consulta remarcada com sucesso.',
            'consulta' => $consulta
        ], 200);
    }

    public function destroy(Consulta $consulta)
    {
        try {
            // Altera o status da consulta para 'cancelado'
            $consulta->update(['status' => 'cancelado']);

            return response()->json([
                'status' => true,
                'message' => 'Consulta cancelada com sucesso.',
                'consulta' => $consulta->load($this->relations),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao cancelar consulta: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao cancelar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function consultasAgendadas()
    {
        try {
            $consultas = Consulta::with($this->relations)->where('status', 'agendada')->get();

            return response()->json([
                'status' => true,
                'message' => 'Consultas agendadas obtidas com sucesso.',
                'consultas' => $consultas,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar consultas agendadas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas agendadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function showAgendada($id)
    {
        try {
            $consulta = Consulta::with($this->relations)
                                ->where('id', $id)
                                ->where('status', 'agendada')
                                ->first();

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada ou não está agendada.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Consulta agendada obtida com sucesso.',
                'consulta' => $consulta,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar consulta agendada: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar a consulta agendada.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a quantidade total de consultas.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function quantidadeTotal()
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
    public function quantidadeAgendadas()
    {
        $agendadas = Consulta::where('status', 'agendada')->count();
        return response()->json([
            'status' => true,
            'message' => 'Quantidade de consultas agendadas obtida com sucesso.',
            'quantidade_agendadas' => $agendadas,
        ], 200);
    }
}