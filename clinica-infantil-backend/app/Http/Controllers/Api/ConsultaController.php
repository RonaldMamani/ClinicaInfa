<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConcluirConsultaRequest;
use App\Http\Requests\ConsultaRequest;
use App\Http\Requests\PagamentoRequest;
use App\Http\Requests\RemarcarConsultaRequest;
use App\Models\Consulta;
use App\Models\Medico;
use App\Models\Pagamento;
use App\Models\Prontuario;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ConsultaController extends Controller
{
    protected $relations = [
        'paciente.cliente',
        'paciente.responsavel',
        'paciente.responsavel.cliente',
        'paciente.cliente.genero',
        'medico',
        'medico.usuario.perfil', 
        'medico.usuario.funcionario',
        'pagamento'
    ];

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

    public function consultasListar(Request $request): JsonResponse
    {
        try {
            $consultas = Consulta::with($this->relations)->paginate(15);

            return response()->json([
                'status' => true,
                'message' => 'Lista de consultas paginada obtida com sucesso.',
                'consultas' => $consultas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar consultas paginadas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas paginadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function consultasAgendadasListar(Request $request): JsonResponse
    {
        try {
            $consultas = Consulta::with($this->relations)
                ->whereIn('status', ['agendada', 'concluida'])
                ->orderBy('data_consulta', 'asc')
                ->orderBy('hora_inicio', 'asc')
                ->paginate(15);

            return response()->json([
                'status' => true,
                'message' => 'Lista de consultas agendadas e concluídas paginada obtida com sucesso.',
                'consultas' => $consultas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar consultas agendadas e concluídas paginadas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas agendadas e concluídas paginadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(ConsultaRequest $request)
    {
        try {
            $validatedData = $request->validated();
            
            // Adiciona o status padrão antes de criar o registro.
            // Isso garante que o campo 'status' seja sempre definido.
            $validatedData['status'] = 'agendada';

            // O `Consulta::create` agora receberá o status padrão
            $consulta = Consulta::create($validatedData);

            // Carrega os relacionamentos aninhados para o retorno.
            return response()->json([
                'status' => true,
                'message' => 'Consulta criada com sucesso.',
                'consulta' => $consulta->load($this->relations),
            ], 201);
        } catch (Exception $e) {
            Log::error('Erro ao criar consulta: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function storeMedico(Request $request)
    {
        $usuario = Auth::user();

        // Garante que o usuário autenticado é um médico
        if (!$usuario || !$usuario->medico) {
            return response()->json(['message' => 'Perfil de médico não encontrado.'], 403);
        }
        
        $medico = $usuario->medico;

        // Validação dos dados recebidos, incluindo o campo 'descricao'
        $request->validate([
            'id_paciente' => 'required|exists:pacientes,id',
            'data_consulta' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim' => 'required|date_format:H:i|after:hora_inicio',
            'descricao' => 'required|string|max:1000',
        ]);
        
        try {
            // Cria a nova consulta com os dados validados
            $consulta = new Consulta();
            $consulta->id_paciente = $request->input('id_paciente');
            $consulta->id_medico = $medico->id;
            $consulta->data_consulta = $request->input('data_consulta');
            $consulta->hora_inicio = $request->input('hora_inicio');
            $consulta->hora_fim = $request->input('hora_fim');
            $consulta->descricao = $request->input('descricao');
            $consulta->status = 'agendada';
            $consulta->save();

            return response()->json([
                'status' => true,
                'message' => 'Consulta agendada com sucesso.',
                'consulta' => $consulta
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erro ao agendar consulta (storeMedico): ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao agendar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

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

    public function concluir(ConcluirConsultaRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $consulta = Consulta::with('paciente')->find($id);

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.'
                ], 404);
            }

            // Atualiza a descrição e o status da consulta
            $consulta->descricao = $request->input('descricao');
            $consulta->status = 'concluida';
            $consulta->save();

            // Lógica para criar ou atualizar o prontuário
            $prontuarioData = $request->input('prontuario');

            if ($prontuarioData) {
                $prontuarioExistente = Prontuario::where('id_paciente', $consulta->id_paciente)->first();
                $idMedico = $consulta->id_medico;

                if ($prontuarioExistente) {
                    // Se o prontuário já existe, atualiza-o
                    $prontuarioExistente->update(array_merge($prontuarioData, [
                        'id_medico' => $idMedico,
                    ]));
                } else {
                    // Se o prontuário não existe, cria um novo
                    Prontuario::create(array_merge($prontuarioData, [
                        'id_paciente' => $consulta->id_paciente,
                        'id_medico' => $idMedico,
                    ]));
                }
            }

            $consulta->load(['paciente.cliente', 'paciente.responsavel.cliente', 'medico.usuario.funcionario']);

            return response()->json([
                'status' => true,
                'message' => 'Consulta concluída com sucesso.',
                'consulta' => $consulta
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao concluir consulta: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao concluir a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function finalizarConsulta(PagamentoRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            Log::info('Dados da requisição para finalizar consulta:', $request->all());

            $consulta = Consulta::find($id);

            if (!$consulta) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.'
                ], 404);
            }

            if ($consulta->status !== 'concluida') {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => 'A consulta só pode ser finalizada se o status for "concluida".'
                ], 400);
            }

            $consulta->status = 'finalizada';
            $consulta->save();

            $dataPagamentoRaw = $request->input('data_pagamento');
            $dataPagamentoFormatada = null;

            if ($dataPagamentoRaw) {
                $dataPagamentoFormatada = Carbon::parse($dataPagamentoRaw)
                                               ->setTimezone(config('app.timezone'))
                                               ->format('Y-m-d H:i:s');

                Log::info('Data de pagamento convertida de ' . $dataPagamentoRaw . ' (UTC) para ' . $dataPagamentoFormatada . ' (Local)');
            }

            $pagamento = Pagamento::create([
                'id_consulta' => $consulta->id,
                'valor' => $request->valor,
                'metodo_pagamento' => $request->metodo_pagamento,
                'data_pagamento' => $dataPagamentoFormatada,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Consulta finalizada e pagamento registrado com sucesso.',
                'consulta' => $consulta->load($this->relations),
                'pagamento' => $pagamento,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao finalizar consulta: ' . $e->getMessage() . ' na linha ' . $e->getLine() . ' no arquivo ' . $e->getFile());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao finalizar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        Log::info('Tentativa de cancelar a consulta com ID: ' . $id);

        try {
            $consulta = Consulta::find($id);

            if (!$consulta) {
                return response()->json([
                    'status' => false,
                    'message' => 'Consulta não encontrada.',
                ], 404);
            }

            $consulta->status = 'cancelada';
            
            if ($consulta->save()) {
                $consulta->refresh();
                
                Log::info('Consulta ' . $consulta->id . ' cancelada com sucesso. Status agora é ' . $consulta->status);

                return response()->json([
                    'status' => true,
                    'message' => 'Consulta cancelada com sucesso.',
                    'consulta' => $consulta->load($this->relations),
                ], 200);
            } else {
                Log::error('Falha ao salvar o novo status para a consulta ' . $id);
                return response()->json([
                    'status' => false,
                    'message' => 'Ocorreu um erro ao atualizar o status da consulta. Por favor, verifique os logs para mais detalhes.',
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Erro ao cancelar consulta: ' . $e->getMessage() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao cancelar a consulta.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function consultasMedico()
    {
        // Obtém o usuário autenticado, que é um modelo Usuario
        $usuario = Auth::user();

        if (!$usuario) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        // Usa o relacionamento 'medico' para encontrar o médico associado
        $medico = $usuario->medico;

        if (!$medico) {
            Log::warning('Usuário autenticado ' . $usuario->id . ' não tem perfil de médico.');
            return response()->json(['message' => 'Perfil de médico não encontrado.'], 403);
        }

        try {
            // Busca as consultas filtrando pelo 'id_medico' e usa paginação
            $consultas = Consulta::with($this->relations)
                                ->where('id_medico', $medico->id)
                                ->orderBy('id', 'asc')
                                ->paginate(15);

            return response()->json([
                'status' => true,
                'message' => 'Consultas do médico obtidas com sucesso.',
                'consultas' => $consultas, // O Laravel já retorna o objeto de paginação completo aqui
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar consultas do médico: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function consultasMedicoAgendados()
    {
        // Obtém o usuário autenticado, que é um modelo Usuario
        $usuario = Auth::user();

        if (!$usuario) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        // Usa o relacionamento 'medico' para encontrar o médico associado
        $medico = $usuario->medico;

        if (!$medico) {
            Log::warning('Usuário autenticado ' . $usuario->id . ' não tem perfil de médico.');
            return response()->json(['message' => 'Perfil de médico não encontrado.'], 403);
        }

        try {
            // Busca as consultas filtrando pelo 'id_medico' e usa paginação
            $consultas = Consulta::with($this->relations)
                                ->where('id_medico', $medico->id)
                                ->where('status', 'agendada')
                                ->orderBy('data_consulta', 'asc')
                                ->orderBy('hora_inicio', 'asc')
                                ->paginate(15);

            return response()->json([
                'status' => true,
                'message' => 'Consultas agendadas do médico obtidas com sucesso.',
                'consultas' => $consultas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar consultas do médico: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar as consultas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function consultasAgendadas()
    {
        try {
            $consultas = Consulta::with($this->relations)->whereIn('status', ['agendada', 'concluida'])->get();

            return response()->json([
                'status' => true,
                'message' => 'Consultas agendadas e concluidas obtidas com sucesso.',
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

    public function showAgendada($id): JsonResponse
    {
        try {
            $consulta = Consulta::with($this->relations)
                ->where('id', $id)
                ->whereIn('status', ['agendada', 'concluida'])
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

        } catch (Exception $e) {
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
        $agendadas = Consulta::whereIn('status', ['agendada', 'concluidas' , 'Agendada'])->count();
        return response()->json([
            'status' => true,
            'message' => 'Quantidade de consultas agendadas obtida com sucesso.',
            'quantidade' => $agendadas,
        ], 200);
    }

    public function todasAsEstatisticas()
    {
        $total = Consulta::count();
        $agendadas = Consulta::where('status', 'agendada')->count();
        $canceladas = Consulta::where('status', 'cancelada')->count();
        $finalizadas = Consulta::whereIn('status', ['finalizada', 'concluida'])->count();

        return response()->json([
            'status' => true,
            'message' => 'Todas as estatísticas de consultas obtidas com sucesso.',
            'dados' => [
                'total' => $total,
                'agendadas' => $agendadas,
                'canceladas' => $canceladas,
                'finalizadas' => $finalizadas
            ]
        ], 200);
    }

    /**
     * Retorna a contagem de todas as consultas do médico autenticado.
     *
     * @return JsonResponse
     */
    public function countAllConsultas(): JsonResponse
    {
        try {
            $medicoId = Medico::where('id_usuario', Auth::id())->first()->id;
            $count = Consulta::where('id_medico', $medicoId)->count();

            return response()->json([
                'status' => true,
                'total_consultas' => $count,
                'message' => 'Contagem de consultas totais obtida com sucesso.'
            ]);
        } catch (\Exception $e) {
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
    public function countAgendadasConsultas(): JsonResponse
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
        } catch (\Exception $e) {
            Log::error('Erro ao contar consultas agendadas: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao obter a contagem de consultas agendadas.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}