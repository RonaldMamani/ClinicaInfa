<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PerfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Defina como true para permitir que a requisição seja processada.
        // Em um ambiente real, você implementaria lógica de autorização aqui (ex: verificar permissões do usuário).
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtém o ID do perfil da rota, se estiver presente (para operações de PUT/PATCH)
        $perfilId = $this->route('id');

        return [
            'nome_perfil' => [
                'required',
                'string',
                'max:255',
                // Garante que o nome_perfil seja único, ignorando o próprio perfil ao editar
                Rule::unique('perfis', 'nome_perfil')->ignore($perfilId),
            ],
            'descricao' => 'nullable|string|max:255', // Descrição é opcional
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
            'nome_perfil.required' => 'O campo nome do perfil é obrigatório.',
            'nome_perfil.string' => 'O campo nome do perfil deve ser um texto.',
            'nome_perfil.max' => 'O campo nome do perfil não pode ter mais de 255 caracteres.',
            'nome_perfil.unique' => 'Este nome de perfil já existe.',
            'descricao.string' => 'O campo descrição deve ser um texto.',
            'descricao.max' => 'O campo descrição não pode ter mais de 255 caracteres.',
        ];
    }
}
