<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            // Regras obrigatórias para a tabela 'clientes'
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|max:14|unique:clientes,cpf,' . ($this->cliente ? $this->cliente->id : 'NULL'),
            'rg' => 'required|string|max:20|unique:clientes,rg,' . ($this->cliente ? $this->cliente->id : 'NULL'),
            'endereco' => 'required|string|max:255',
            'id_cidade' => 'required|integer|exists:cidades,id',
            'id_genero' => 'required|integer|exists:generos,id',
        ];

        // Regras opcionais para a tabela 'responsaveis' (só serão validadas se estiverem presentes no payload)
        if ($this->has('grau_parentesco') || $this->has('email') || $this->has('telefone')) {
            $rules['grau_parentesco'] = 'required|string|max:255';
            $rules['email'] = 'required|email|max:255|unique:responsaveis,email,' . ($this->id_responsavel ?? 'NULL') . ',id';
            $rules['telefone'] = 'required|string|max:20';
        }

        // Regras opcionais para a tabela 'pacientes' (só serão validadas se estiverem presentes no payload)
        if ($this->has('data_nascimento') || $this->has('historico_medico')) {
            $rules['data_nascimento'] = 'required|date';
            $rules['historico_medico'] = 'nullable|string';
            $rules['id_responsavel'] = 'sometimes|nullable|integer|exists:responsaveis,id';
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'id_genero' => 'ID do Gênero',
            'id_cidade' => 'ID da Cidade',
            'id_responsavel' => 'ID do Responsável',
            'grau_parentesco' => 'Grau de Parentesco',
            'data_nascimento' => 'Data de Nascimento',
            'historico_medico' => 'Histórico Médico'
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
