<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RedefinirSenhaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Altere para 'true' se a autorização for gerenciada em outro lugar (ex: middlewares)
        return true;
    }

    /**
     * Define as regras de validação que se aplicam à requisição.
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // A nova senha deve ser uma string, obrigatória e ter no mínimo 8 caracteres.
            'senha' => ['required', 'string', 'min:8'],
        ];
    }
}
