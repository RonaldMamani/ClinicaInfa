<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PagamentoUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Altere para a lógica de autorização necessária.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // id_consulta geralmente não deve ser alterado após a criação
            'valor' => ['sometimes', 'required', 'numeric', 'min:0'],
            'data_pagamento' => ['sometimes', 'required', 'date'],
            'metodo_pagamento' => ['sometimes', 'required', 'string', 'max:50'],
            'status_pagamento' => ['sometimes', 'required', 'string', 'max:50'],
        ];
    }
}
