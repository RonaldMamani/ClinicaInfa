<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProntuarioStoreRequest;
use App\Http\Requests\ProntuarioUpdateRequest;
use App\Models\Prontuario;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProntuarioController extends Controller
{
    /**
     * Define os relacionamentos a serem carregados.
     */
    protected $relations = [
        'paciente.cliente',
        'paciente.cliente.genero',
        'medico',
        'paciente.consultas' => ['medico.usuario.funcionario'],
    ];

    /**
     * Lista todos os prontuários do banco de dados, com paginação.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $prontuarios = Prontuario::with($this->relations)
                ->orderBy('id', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => true,
                'message' => 'Prontuários listados com sucesso.',
                'prontuarios' => $prontuarios,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao listar prontuários: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao listar prontuários. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Exibe um prontuário específico pelo seu ID.
     *
     * @param Prontuario $prontuario O prontuário a ser exibido (via Route Model Binding).
     * @return JsonResponse
     */
    public function show(Prontuario $prontuario): JsonResponse
    {
        try {
            // Carrega os relacionamentos do prontuário encontrado
            $prontuario->load($this->relations);

            return response()->json([
                'status' => true,
                'message' => 'Detalhes do prontuário carregados com sucesso.',
                'prontuario' => $prontuario,
            ], 200);

        } catch (Exception $e) {
            Log::error('Erro ao buscar prontuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar prontuário. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Exibe o prontuário de um paciente específico pelo seu ID.
     *
     * @param int $idPaciente O ID do paciente.
     * @return JsonResponse
     */
    public function showByPacienteId(int $idPaciente): JsonResponse
    {
        try {
            $prontuario = Prontuario::where('id_paciente', $idPaciente)
                ->with($this->relations)
                ->firstOrFail();

            return response()->json([
                'status' => true,
                'prontuario' => $prontuario,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Prontuário não encontrado para este paciente.',
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao buscar prontuário por ID do paciente: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao buscar o prontuário. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Verifica se existe um prontuário para um paciente.
     *
     * @param int $idPaciente O ID do paciente.
     * @return JsonResponse
     */
    public function checkProntuario(int $idPaciente): JsonResponse
    {
        $prontuarioExistente = Prontuario::where('id_paciente', $idPaciente)->exists();
        
        return response()->json([
            'status' => true,
            'existe_prontuario' => $prontuarioExistente,
        ]);
    }

    /**
     * Cria um novo prontuário no banco de dados.
     *
     * @param ProntuarioStoreRequest $request A requisição validada.
     * @return JsonResponse
     */
    public function store(ProntuarioStoreRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $idPaciente = $request->input('id_paciente');

            // Verifica se já existe um prontuário para o paciente
            if (Prontuario::where('id_paciente', $idPaciente)->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Um prontuário para este paciente já existe.'
                ], 409);
            }

            // O seu método original combinava os dados com o ID do médico logado.
            // Mantemos essa lógica aqui.
            $usuario = Auth::user();
            if (!$usuario || !$usuario->medico) {
                return response()->json(['message' => 'Perfil de médico não encontrado.'], 403);
            }

            $prontuarioData = array_merge($request->validated(), [
                'id_medico' => $usuario->medico->id,
            ]);

            $prontuario = Prontuario::create($prontuarioData);
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Prontuário criado com sucesso.',
                'prontuario' => $prontuario->load($this->relations),
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar prontuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao criar o prontuário. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Atualiza um prontuário existente.
     *
     * @param ProntuarioUpdateRequest $request A requisição validada.
     * @param Prontuario $prontuario O prontuário a ser atualizado (via Route Model Binding).
     * @return JsonResponse
     */
    public function update(ProntuarioUpdateRequest $request, Prontuario $prontuario): JsonResponse
    {
        DB::beginTransaction();
        try {
            $prontuario->update($request->validated());
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Prontuário atualizado com sucesso.',
                'prontuario' => $prontuario->load($this->relations),
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar prontuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao atualizar o prontuário. Verifique os logs do servidor.',
            ], 500);
        }
    }

    /**
     * Deleta um prontuário.
     *
     * @param Prontuario $prontuario O prontuário a ser deletado (via Route Model Binding).
     * @return JsonResponse
     */
    public function destroy(Prontuario $prontuario): JsonResponse
    {
        DB::beginTransaction();
        try {
            $prontuario->delete();
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Prontuário deletado com sucesso.',
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erro ao deletar prontuário: ' . $e->getMessage() . ' - ' . $e->getFile() . ' na linha ' . $e->getLine());
            return response()->json([
                'status' => false,
                'message' => 'Ocorreu um erro ao deletar o prontuário. Verifique os logs do servidor.',
            ], 500);
        }
    }
}
