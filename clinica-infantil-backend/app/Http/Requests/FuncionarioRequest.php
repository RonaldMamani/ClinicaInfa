<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FuncionarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Defina como true para permitir que a requisição seja processada.
        // Em um ambiente real, você implementaria lógica de autorização aqui (ex: verificar permissões do usuário).
        return true;
    }

    public function rules(): array
    {
        // Obtém o ID do funcionário da rota, se estiver presente (para operações de PUT/PATCH)
        $funcionarioId = $this->route('id');

        return [
            'nome' => 'required|string|max:255',
            'cpf' => [
                'required',
                'string',
                'max:11',
                // Garante que o CPF seja único, ignorando o próprio funcionário ao editar
                Rule::unique('funcionarios', 'cpf')->ignore($funcionarioId),
            ],
            'cargo' => 'required|string|max:50',
            'email_empresarial' => [
                'required',
                'string',
                'email',
                'max:255',
                // Garante que o email_empresarial seja único, ignorando o próprio funcionário ao editar
                Rule::unique('funcionarios', 'email_empresarial')->ignore($funcionarioId),
            ],
            'telefone_empresarial' => 'nullable|string|max:20', // Telefone é opcional
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O campo nome é obrigatório.',
            'nome.string' => 'O campo nome deve ser um texto.',
            'nome.max' => 'O campo nome não pode ter mais de 255 caracteres.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.string' => 'O campo CPF deve ser um texto.',
            'cpf.max' => 'O campo CPF não pode ter mais de 11 caracteres.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'cargo.required' => 'O campo cargo é obrigatório.',
            'cargo.string' => 'O campo cargo deve ser um texto.',
            'cargo.max' => 'O campo cargo não pode ter mais de 50 caracteres.',
            'email_empresarial.required' => 'O campo e-mail empresarial é obrigatório.',
            'email_empresarial.string' => 'O campo e-mail empresarial deve ser um texto.',
            'email_empresarial.email' => 'O campo e-mail empresarial deve ser um endereço de e-mail válido.',
            'email_empresarial.max' => 'O campo e-mail empresarial não pode ter mais de 255 caracteres.',
            'email_empresarial.unique' => 'Este e-mail empresarial já está cadastrado.',
            'telefone_empresarial.string' => 'O campo telefone empresarial deve ser um texto.',
            'telefone_empresarial.max' => 'O campo telefone empresarial não pode ter mais de 20 caracteres.',
        ];
    }
}
