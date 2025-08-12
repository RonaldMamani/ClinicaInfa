<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsultaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Neste caso, retornamos 'true' para permitir a validação da requisição
     * sem a necessidade de uma autorização complexa. Se você precisar
     * verificar se o usuário logado pode criar ou atualizar a consulta,
     * a lógica de verificação pode ser adicionada aqui.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        // Garante que o formato de hora seja HH:MM:SS,
        // mesmo que o frontend envie apenas HH:MM
        if ($this->hora_inicio && !str_contains($this->hora_inicio, ':')) {
            $this->merge(['hora_inicio' => $this->hora_inicio . ':00']);
        }
        if ($this->hora_fim && !str_contains($this->hora_fim, ':')) {
            $this->merge(['hora_fim' => $this->hora_fim . ':00']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Agora todas as regras de validação estão presentes
            'id_paciente' => 'required|integer|exists:pacientes,id',
            'id_medico' => 'required|integer|exists:medicos,id',
            'data_consulta' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i:s',
            'hora_fim' => 'required|date_format:H:i:s|after:hora_inicio',
            'descricao' => 'nullable|string',
            'status' => ['nullable', 'string', 'in:agendada,finalizada,cancelada'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id_paciente.required' => 'O campo paciente é obrigatório.',
            'id_paciente.exists' => 'O paciente selecionado não existe.',
            'id_medico.required' => 'O campo médico é obrigatório.',
            'id_medico.exists' => 'O médico selecionado não existe.',
            'data_consulta.required' => 'A data da consulta é obrigatória.',
            'data_consulta.date' => 'A data da consulta deve ser uma data válida.',
            'hora_inicio.required' => 'A hora de início é obrigatória.',
            'hora_inicio.date_format' => 'A hora de início deve estar no formato HH:MM:SS.',
            'hora_fim.required' => 'A hora de fim é obrigatória.',
            'hora_fim.date_format' => 'A hora de fim deve estar no formato HH:MM:SS.',
            'hora_fim.after' => 'A hora de fim deve ser posterior à hora de início.',
            'descricao.string' => 'O campo descrição deve ser um texto.',
        ];
    }
}