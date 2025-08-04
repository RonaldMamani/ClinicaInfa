<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicoProntuarioRequest;
use App\Http\Requests\ProntuarioRequest;
use App\Models\Prontuario;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProntuarioController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $prontuarios = Prontuario::with(['paciente.cliente'])->paginate(10);
            
            return response()->json([
                'status' => true,
                'message' => 'Prontuários listados com sucesso.',
                'prontuarios' => $prontuarios
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao listar prontuários: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar prontuários.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function checkProntuario(int $idPaciente): JsonResponse
    {
        $prontuarioExistente = Prontuario::where('id_paciente', $idPaciente)->first();
        
        return response()->json([
            'status' => true,
            'existe_prontuario' => (bool)$prontuarioExistente,
        ]);
    }

    /**
     * Armazena um novo prontuário no banco de dados.
     *
     * @param ProntuarioRequest $request
     * @return JsonResponse
     */
    public function store(ProntuarioRequest $request): JsonResponse
    {
        try {
            $prontuario = Prontuario::create($request->validated());

            return response()->json([
                'status' => true,
                'message' => 'Prontuário criado com sucesso.',
                'prontuario' => $prontuario->load(['paciente', 'medico'])
            ], 201);

        } catch (Exception $e) {
            Log::error("Erro ao criar prontuário: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o prontuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function storeMedico(MedicoProntuarioRequest $request): JsonResponse
    {
        $usuario = Auth::user();

        if (!$usuario || !$usuario->medico) {
            return response()->json(['message' => 'Perfil de médico não encontrado.'], 403);
        }

        $idPaciente = $request->input('id_paciente');

        // Verifica se já existe um prontuário para o paciente
        $prontuarioExistente = Prontuario::where('id_paciente', $idPaciente)->first();

        if ($prontuarioExistente) {
            return response()->json([
                'status' => false,
                'message' => 'Um prontuário para este paciente já existe.'
            ], 409); // Código de status 409 Conflict
        }
        
        try {
            // Combina os dados validados com o id do médico logado
            $prontuarioData = array_merge($request->validated(), [
                'id_medico' => $usuario->medico->id,
            ]);

            $prontuario = Prontuario::create($prontuarioData);

            return response()->json([
                'status' => true,
                'message' => 'Prontuário criado com sucesso.',
                'prontuario' => $prontuario->load(['paciente', 'medico'])
            ], 201);

        } catch (Exception $e) {
            Log::error("Erro ao criar prontuário pelo médico: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o prontuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um prontuário específico.
     *
     * @param Prontuario $prontuario
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $prontuario = Prontuario::with([
                'paciente.cliente',
                'paciente.consultas' => function ($query) {
                    $query->with(['medico.usuario.funcionario'])->orderBy('data_consulta', 'desc');
                }
            ])->find($id);

            if (!$prontuario) {
                return response()->json([
                    'status' => false,
                    'message' => 'Prontuário não encontrado.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do prontuário carregados com sucesso.',
                'prontuario' => $prontuario
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar prontuário: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar prontuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function showByPacienteId(int $idPaciente): \Illuminate\Http\JsonResponse
    {
        $prontuario = Prontuario::where('id_paciente', $idPaciente)->with(['medico', 'paciente'])->first();

        if (!$prontuario) {
            return response()->json([
                'status' => false,
                'message' => 'Prontuário não encontrado para este paciente.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'prontuario' => $prontuario
        ]);
    }

    /**
     * Atualiza um prontuário existente.
     *
     * @param ProntuarioRequest $request
     * @param Prontuario $prontuario
     * @return JsonResponse
     */
    public function update(ProntuarioRequest $request, Prontuario $prontuario): JsonResponse
    {
        try {
            $prontuario->update($request->validated());

            return response()->json([
                'status' => true,
                'message' => 'Prontuário atualizado com sucesso.',
                'prontuario' => $prontuario->load(['paciente', 'medico'])
            ]);

        } catch (Exception $e) {
            Log::error("Erro ao atualizar prontuário: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o prontuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um prontuário do banco de dados.
     *
     * @param Prontuario $prontuario
     * @return JsonResponse
     */
    public function destroy(Prontuario $prontuario): JsonResponse
    {
        try {
            $prontuario->delete();

            return response()->json([
                'status' => true,
                'message' => 'Prontuário excluído com sucesso.'
            ]);

        } catch (Exception $e) {
            Log::error("Erro ao excluir prontuário: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao excluir o prontuário.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
