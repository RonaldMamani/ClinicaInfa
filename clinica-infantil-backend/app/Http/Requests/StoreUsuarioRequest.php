<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Implementar lógica de autorização.
        // Por exemplo, apenas administradores podem criar novos usuários.
        return true; // Retorne true para permitir a requisição por enquanto
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255',
            'senha' => 'required|string|min:8',
            'id_perfil' => 'required|integer|exists:perfis,id',
            'ativo' => 'boolean',
            'funcionario.nome' => 'required|string|max:255',
            'funcionario.cpf' => 'required|string|max:14',
            'funcionario.cargo' => 'required|string|max:255',
            'funcionario.email_empresarial' => 'required|email|max:255',
            'funcionario.telefone_empresarial' => 'required|string|max:30',
            
            // Regras para os dados do médico - ISSO É CRUCIAL
            'medico.CRM' => 'sometimes|required_if:id_perfil,2|string|max:255',
            'medico.especialidade' => 'sometimes|required_if:id_perfil,2|string|max:255',
        ];
    }

    /**
     * Prepara os dados para validação.
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // Garante que 'ativo' seja um booleano (default para true se não enviado)
        if (!$this->has('ativo')) {
            $this->merge([
                'ativo' => true,
            ]);
        } else {
            $this->merge([
                'ativo' => (bool) $this->ativo,
            ]);
        }
    }
}
