<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResponsavelUpdateRequest extends FormRequest
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
        // Aqui usamos 'sometimes' para que os campos sejam validados apenas se existirem na requisição.
        return [
            'grau_parentesco' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'telefone' => ['sometimes', 'nullable', 'string', 'max:20'],
            // Regras para os dados do cliente associado, também com 'sometimes'
            'cliente.nome_completo' => ['sometimes', 'required', 'string', 'max:255'],
            'cliente.data_nascimento' => ['sometimes', 'required', 'date'],
            'cliente.ativo' => ['sometimes', 'required', 'boolean'],
            // ... outras regras para cliente
        ];
    }
}
