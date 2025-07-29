<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
        // Obtém o ID do médico da rota, se estiver presente (para operações de PUT/PATCH)
        $medicoId = $this->route('id');

        return [
            'id_usuario' => 'required|integer|exists:usuarios,id',
            'CRM' => [
                'required',
                'string',
                'max:20',
                Rule::unique('medicos', 'CRM')->ignore($medicoId), // CRM deve ser único
            ],
            'especialidade' => 'required|string|max:100',
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
            'id_usuario.required' => 'O campo usuário é obrigatório.',
            'id_usuario.integer' => 'O campo usuário deve ser um número inteiro.',
            'id_usuario.exists' => 'O usuário selecionado não existe.',
            'CRM.required' => 'O campo CRM é obrigatório.',
            'CRM.string' => 'O campo CRM deve ser um texto.',
            'CRM.max' => 'O campo CRM não pode ter mais de 20 caracteres.',
            'CRM.unique' => 'Este CRM já está cadastrado.',
            'especialidade.required' => 'O campo especialidade é obrigatório.',
            'especialidade.string' => 'O campo especialidade deve ser um texto.',
            'especialidade.max' => 'O campo especialidade não pode ter mais de 100 caracteres.',
        ];
    }
}
