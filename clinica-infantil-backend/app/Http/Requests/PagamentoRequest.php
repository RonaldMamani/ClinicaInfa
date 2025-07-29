<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PagamentoRequest extends FormRequest
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
            'id_consulta' => 'required|integer|exists:consultas,id',
            'valor' => 'required|numeric|min:0.01|decimal:0,2', // Valor obrigatório, numérico, mínimo 0.01, 2 casas decimais
            'metodo_pagamento' => 'required|string|max:50',
            'data_pagamento' => 'required|date_format:Y-m-d H:i:s|before_or_equal:now', // Formato YYYY-MM-DD HH:MM:SS, não pode ser no futuro
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
            'id_consulta.required' => 'O campo consulta é obrigatório.',
            'id_consulta.integer' => 'O campo consulta deve ser um número inteiro.',
            'id_consulta.exists' => 'A consulta selecionada não existe.',
            'valor.required' => 'O campo valor é obrigatório.',
            'valor.numeric' => 'O campo valor deve ser um número.',
            'valor.min' => 'O campo valor deve ser no mínimo :min.',
            'valor.decimal' => 'O campo valor deve ter no máximo 2 casas decimais.',
            'metodo_pagamento.required' => 'O campo método de pagamento é obrigatório.',
            'metodo_pagamento.string' => 'O campo método de pagamento deve ser um texto.',
            'metodo_pagamento.max' => 'O campo método de pagamento não pode ter mais de 50 caracteres.',
            'data_pagamento.required' => 'O campo data do pagamento é obrigatório.',
            'data_pagamento.date_format' => 'O campo data do pagamento deve estar no formato YYYY-MM-DD HH:MM:SS.',
            'data_pagamento.before_or_equal' => 'A data do pagamento não pode ser no futuro.',
        ];
    }
}
