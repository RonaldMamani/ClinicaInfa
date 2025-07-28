<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PacienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Defina como true para permitir que a requisição seja processada.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_cliente' => 'required|integer|exists:clientes,id',
            'id_responsavel' => 'required|integer|exists:responsaveis,id',
            'data_nascimento' => 'required|date|before_or_equal:today', // Data de nascimento obrigatória, formato de data, não pode ser no futuro
            'historico_medico' => 'nullable|string', // Histórico médico é opcional
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
            'id_cliente.required' => 'O campo cliente é obrigatório.',
            'id_cliente.integer' => 'O campo cliente deve ser um número inteiro.',
            'id_cliente.exists' => 'O cliente selecionado não existe.',
            'id_responsavel.required' => 'O campo responsável é obrigatório.',
            'id_responsavel.integer' => 'O campo responsável deve ser um número inteiro.',
            'id_responsavel.exists' => 'O responsável selecionado não existe.',
            'data_nascimento.required' => 'O campo data de nascimento é obrigatório.',
            'data_nascimento.date' => 'O campo data de nascimento deve ser uma data válida.',
            'data_nascimento.before_or_equal' => 'A data de nascimento não pode ser no futuro.',
            'historico_medico.string' => 'O campo histórico médico deve ser um texto.',
        ];
    }
}
