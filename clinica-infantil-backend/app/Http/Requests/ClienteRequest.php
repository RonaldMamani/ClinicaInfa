<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $clienteId = $this->route('id');

        return [
            'id_cidade' => 'required|integer|exists:cidades,id',
            'id_genero' => 'required|integer|exists:generos,id',
            'cpf' => [
                'required',
                'string',
                'max:14',
                Rule::unique('clientes', 'cpf')->ignore($clienteId),
            ],
            'rg' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('clientes', 'rg')->ignore($clienteId),
            ],
            'nome' => 'required|string|max:255',
            'endereco' => 'nullable|string',
            'ativo' => 'boolean', // <--- Validação para o campo 'ativo'
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
            'id_cidade.required' => 'O campo cidade é obrigatório.',
            'id_cidade.integer' => 'O campo cidade deve ser um número inteiro.',
            'id_cidade.exists' => 'A cidade selecionada não existe.',
            'id_genero.required' => 'O campo gênero é obrigatório.',
            'id_genero.integer' => 'O campo gênero deve ser um número inteiro.',
            'id_genero.exists' => 'O gênero selecionado não existe.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.string' => 'O campo CPF deve ser um texto.',
            'cpf.max' => 'O campo CPF não pode ter mais de 14 caracteres.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'rg.unique' => 'Este RG já está cadastrado.',
            'nome.required' => 'O campo nome é obrigatório.',
            'nome.string' => 'O campo nome deve ser um texto.',
            'nome.max' => 'O campo nome não pode ter mais de 255 caracteres.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}
