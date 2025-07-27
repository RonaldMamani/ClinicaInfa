<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResponsavelRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Defina como true para permitir que a requisição seja processada.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtém o ID do responsável da rota, se estiver presente (para operações de PUT/PATCH)
        $responsavelId = $this->route('id');

        return [
            'id_cliente' => 'required|integer|exists:clientes,id',
            'grau_parentesco' => 'required|string|max:50',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                // Garante que o email seja único, ignorando o próprio responsável ao editar
                Rule::unique('responsaveis', 'email')->ignore($responsavelId),
            ],
            'telefone' => 'required|string|max:20',
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
            'id_cliente.required' => 'O campo cliente é obrigatório.',
            'id_cliente.integer' => 'O campo cliente deve ser um número inteiro.',
            'id_cliente.exists' => 'O cliente selecionado não existe.',
            'grau_parentesco.required' => 'O campo grau de parentesco é obrigatório.',
            'grau_parentesco.string' => 'O campo grau de parentesco deve ser um texto.',
            'grau_parentesco.max' => 'O campo grau de parentesco não pode ter mais de 50 caracteres.',
            'email.required' => 'O campo e-mail é obrigatório.',
            'email.string' => 'O campo e-mail deve ser um texto.',
            'email.email' => 'O campo e-mail deve ser um endereço de e-mail válido.',
            'email.max' => 'O campo e-mail não pode ter mais de 255 caracteres.',
            'email.unique' => 'Este e-mail já está cadastrado para outro responsável.',
            'telefone.required' => 'O campo telefone é obrigatório.',
            'telefone.string' => 'O campo telefone deve ser um texto.',
            'telefone.max' => 'O campo telefone não pode ter mais de 20 caracteres.',
        ];
    }
}
