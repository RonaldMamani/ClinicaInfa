<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PacienteStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Altere para a lógica de autorização necessária, como verificar se o
        // usuário tem permissão para criar pacientes.
        // Por enquanto, está como 'true' para permitir a requisição.
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
            'nome' => ['required', 'string', 'max:255'],
            'cpf' => ['required', 'string', 'max:14', 'unique:clientes,cpf'],
            'rg' => ['required', 'string', 'max:20'],
            'endereco' => ['required', 'string'],
            'id_cidade' => ['required', 'integer', 'exists:cidades,id'],
            'id_genero' => ['required', 'integer', 'exists:generos,id'],
            'historico_medico' => ['nullable', 'string'],
            'data_nascimento' => ['required', 'date'],
            'id_responsavel' => ['required', 'integer', 'exists:pacientes,id'],
        ];
    }
}
