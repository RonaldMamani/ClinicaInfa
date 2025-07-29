<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsultaRequest extends FormRequest
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
            'data_consulta' => 'required|date_format:Y-m-d H:i:s|after_or_equal:today', // Formato YYYY-MM-DD HH:MM:SS, não pode ser no passado
            'hora_inicio' => 'required|date_format:H:i:s', // Formato HH:MM:SS
            'hora_fim' => 'required|date_format:H:i:s|after:hora_inicio', // Formato HH:MM:SS e deve ser depois da hora_inicio
            'descricao' => 'nullable|string',
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
            'data_consulta.required' => 'O campo data da consulta é obrigatório.',
            'data_consulta.date_format' => 'O campo data da consulta deve estar no formato YYYY-MM-DD HH:MM:SS.',
            'data_consulta.after_or_equal' => 'A data da consulta não pode ser no passado.',
            'hora_inicio.required' => 'O campo hora de início é obrigatório.',
            'hora_inicio.date_format' => 'O campo hora de início deve estar no formato HH:MM:SS.',
            'hora_fim.required' => 'O campo hora de fim é obrigatório.',
            'hora_fim.date_format' => 'O campo hora de fim deve estar no formato HH:MM:SS.',
            'hora_fim.after' => 'A hora de fim deve ser posterior à hora de início.',
            'descricao.string' => 'O campo descrição deve ser um texto.',
        ];
    }
}
