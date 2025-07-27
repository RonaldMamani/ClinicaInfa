<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioRequest extends FormRequest
{
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
        // Obtém o ID do usuário da rota, se estiver presente (para operações de PUT/PATCH)
        $usuarioId = $this->route('id');

        // Regras de validação base
        $rules = [
            'id_perfil' => 'required|integer|exists:perfis,id',
            'id_funcionario' => 'required|integer|exists:funcionarios,id',
            'username' => [
                'required',
                'string',
                'max:255',
                // Garante que o username seja único, ignorando o próprio usuário ao editar
                Rule::unique('usuarios', 'username')->ignore($usuarioId),
            ],
            'ativo' => 'boolean',
        ];

        // Regra para a senha:
        // - 'required' ao criar (POST)
        // - 'nullable' (opcional) ao atualizar (PUT/PATCH), mas se presente, deve ter min 6 caracteres
        if ($this->isMethod('post')) {
            $rules['senha'] = 'required|string|min:6|max:255'; // Max 255 para o hash da senha
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['senha'] = 'nullable|string|min:6|max:255';
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id_perfil.required' => 'O campo perfil é obrigatório.',
            'id_perfil.integer' => 'O campo perfil deve ser um número inteiro.',
            'id_perfil.exists' => 'O perfil selecionado não existe.',
            'id_funcionario.required' => 'O campo funcionário é obrigatório.',
            'id_funcionario.integer' => 'O campo funcionário deve ser um número inteiro.',
            'id_funcionario.exists' => 'O funcionário selecionado não existe.',
            'username.required' => 'O campo username é obrigatório.',
            'username.string' => 'O campo username deve ser um texto.',
            'username.max' => 'O campo username não pode ter mais de 255 caracteres.',
            'username.unique' => 'Este username já está em uso.',
            'senha.required' => 'O campo senha é obrigatório.',
            'senha.string' => 'O campo senha deve ser um texto.',
            'senha.min' => 'A senha deve ter no mínimo :min caracteres.',
            'senha.max' => 'A senha não pode ter mais de :max caracteres.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}
