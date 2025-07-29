<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProntuarioMedicoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Mantenha como true para permitir a requisição
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_paciente' => 'required|integer|exists:pacientes,id',
            'id_medico' => 'required|integer|exists:medicos,id',
            'id_consulta' => 'required|integer|exists:consultas,id',
            'data_diagnostico' => 'required|date_format:Y-m-d H:i:s|before_or_equal:now', // Formato YYYY-MM-DD HH:MM:SS, não pode ser no futuro
            'diagnostico' => 'required|string',
            'prescricao' => 'nullable|string',
            'observacoes' => 'nullable|string',
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
            'id_paciente.integer' => 'O campo paciente deve ser um número inteiro.',
            'id_paciente.exists' => 'O paciente selecionado não existe.',
            'id_medico.required' => 'O campo médico é obrigatório.',
            'id_medico.integer' => 'O campo médico deve ser um número inteiro.',
            'id_medico.exists' => 'O médico selecionado não existe.',
            'id_consulta.required' => 'O campo consulta é obrigatório.',
            'id_consulta.integer' => 'O campo consulta deve ser um número inteiro.',
            'id_consulta.exists' => 'A consulta selecionada não existe.',
            'data_diagnostico.required' => 'O campo data do diagnóstico é obrigatório.',
            'data_diagnostico.date_format' => 'O campo data do diagnóstico deve estar no formato YYYY-MM-DD HH:MM:SS.',
            'data_diagnostico.before_or_equal' => 'A data do diagnóstico não pode ser no futuro.',
            'diagnostico.required' => 'O campo diagnóstico é obrigatório.',
            'diagnostico.string' => 'O campo diagnóstico deve ser um texto.',
            'prescricao.string' => 'O campo prescrição deve ser um texto.',
            'observacoes.string' => 'O campo observações deve ser um texto.',
        ];
    }
}
