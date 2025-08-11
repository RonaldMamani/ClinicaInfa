<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PacienteUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
            'nome' => ['sometimes', 'required', 'string', 'max:255'],
            'cpf' => [
                'sometimes',
                'required',
                'string',
                'max:14',
                // Ignora o CPF do cliente atual para evitar erros de validação de duplicidade
                Rule::unique('clientes', 'cpf')->ignore($this->paciente->cliente->id),
            ],
            'rg' => ['sometimes', 'required', 'string', 'max:20'],
            'endereco' => ['sometimes', 'required', 'string'],
            'id_cidade' => ['sometimes', 'required', 'integer', 'exists:cidades,id'],
            'id_genero' => ['sometimes', 'required', 'integer', 'exists:generos,id'],
            'historico_medico' => ['sometimes', 'nullable', 'string'],
            'data_nascimento' => ['sometimes', 'required', 'date'],
            'id_responsavel' => ['sometimes', 'required', 'integer', 'exists:pacientes,id'],
        ];
    }
}
