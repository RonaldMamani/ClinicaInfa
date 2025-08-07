<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
     public function authorize(): bool
    {
        // TODO: Implementar lógica de autorização.
        // Por exemplo, apenas administradores ou o próprio usuário podem atualizar.
        return true; // Retorne true para permitir a requisição por enquanto
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // O ID do usuário sendo atualizado é obtido da rota
        $userId = $this->route('usuario'); 
        
        return [
            // Regras para os campos do modelo Usuario
            'username' => [
                'required',
                'string',
                'max:255',
                // Garante que o username seja único, ignorando o próprio usuário que está sendo atualizado
                Rule::unique('usuarios')->ignore($userId), 
            ],
            'id_perfil' => 'required|integer|exists:perfis,id',
            'id_funcionario' => 'required|integer|exists:funcionarios,id',
            'ativo' => 'required|boolean', // O frontend enviará true/false

            // Regras para os campos aninhados do modelo Funcionario (se presentes no request)
            'funcionario.nome' => 'sometimes|required|string|max:255',
            'funcionario.cpf' => 'sometimes|required|string|max:14',
            'funcionario.cargo' => 'sometimes|required|string|max:255',
            'funcionario.email_empresarial' => 'sometimes|required|email|max:255',
            'funcionario.telefone_empresarial' => 'sometimes|required|string|max:20',

            // Regras para os campos aninhados do modelo Medico (se presentes no request)
            // 'sometimes' significa que a regra só será aplicada se o campo estiver presente
            'medico.CRM' => 'sometimes|required|string|max:50',
            'medico.especialidade' => 'sometimes|required|string|max:255',
        ];
    }

    /**
     * Prepara os dados para validação.
     * Pode ser usado para manipular dados antes da validação, como converter tipos.
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // O Laravel geralmente converte booleanos de JSON para 0/1 automaticamente,
        // mas se houver algum problema, você pode forçar aqui.
        if ($this->has('ativo')) {
            $this->merge([
                'ativo' => (bool) $this->ativo,
            ]);
        }
    }
}
