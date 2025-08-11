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
        $userId = $this->route('id');

        return [
            // A regra 'unique' agora ignora o ID do usuário atual.
            'username' => ['required', 'string', 'max:255', Rule::unique('usuarios', 'username')->ignore($userId)],
            
            // ... (outras regras de validação)
            'id_perfil' => 'required|exists:perfis,id',
            'id_funcionario' => 'required|exists:funcionarios,id',
            'ativo' => 'required|boolean',
            
            // Regras para os dados do funcionário
            'funcionario.nome' => 'required|string|max:255',
            'funcionario.cpf' => ['required', 'string', 'max:14', 'regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/'],
            'funcionario.cargo' => 'required|string|max:255',
            'funcionario.email_empresarial' => 'required|email',
            'funcionario.telefone_empresarial' => 'required|string|max:20',
            
            // Regras para os dados do médico, se existirem
            'medico.CRM' => 'nullable|string|max:255',
            'medico.especialidade' => 'nullable|string|max:255',
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
