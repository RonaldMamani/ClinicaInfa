<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RemarcarConsultaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Neste caso, vamos assumir que a autorização é verificada em outro lugar
        // (por exemplo, um middleware).
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'data_consulta' => ['required', 'date'],
            'hora_inicio' => ['required', 'date_format:H:i:s'],
            'hora_fim' => ['required', 'date_format:H:i:s', 'after:hora_inicio'],
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
            'data_consulta.required' => 'A data da consulta é obrigatória.',
            'data_consulta.date' => 'A data da consulta deve ser uma data válida.',
            'hora_inicio.required' => 'A hora de início é obrigatória.',
            'hora_inicio.date_format' => 'A hora de início deve estar no formato HH:MM:SS.',
            'hora_fim.required' => 'A hora de fim é obrigatória.',
            'hora_fim.date_format' => 'A hora de fim deve estar no formato HH:MM:SS.',
            'hora_fim.after' => 'A hora de fim deve ser posterior à hora de início.',
        ];
    }
}
