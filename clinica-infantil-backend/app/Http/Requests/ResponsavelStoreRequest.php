<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResponsavelStoreRequest extends FormRequest
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
            // Exemplo de regras, ajuste conforme a necessidade.
            'grau_parentesco' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'telefone' => ['nullable', 'string', 'max:20'],
            // Regras para os dados do cliente associado
            'cliente.nome_completo' => ['required', 'string', 'max:255'],
            'cliente.data_nascimento' => ['required', 'date'],
            // ... outras regras para cliente
        ];
    }
}
