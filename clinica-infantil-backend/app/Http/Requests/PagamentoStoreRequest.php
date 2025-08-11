<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PagamentoStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Altere para a lógica de autorização necessária, como verificar se o
        // usuário tem permissão para criar pagamentos.
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
            'id_consulta' => ['required', 'integer', 'exists:consultas,id'],
            'valor' => ['required', 'numeric', 'min:0'],
            'data_pagamento' => ['required', 'date'],
            'metodo_pagamento' => ['required', 'string', 'max:50'],
            'status_pagamento' => ['required', 'string', 'max:50'],
        ];
    }
}
