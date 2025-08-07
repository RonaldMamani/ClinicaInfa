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
            // Regras para os campos do modelo Usuario
            'username' => 'required|string|max:255|unique:usuarios,username',
            'senha' => 'required|string|min:8', // Senha mínima de 8 caracteres
            'id_perfil' => 'required|integer|exists:perfis,id',
            // 'id_funcionario' não é necessário aqui, pois o funcionário será criado
            'ativo' => 'boolean', // Pode ser opcional, default para true no controller

            // Regras para os campos aninhados do modelo Funcionario (OBRIGATÓRIOS para criação)
            'funcionario.nome' => 'required|string|max:255',
            'funcionario.cpf' => 'required|string|max:14|unique:funcionarios,cpf', // CPF único para funcionário
            'funcionario.cargo' => 'required|string|max:255',
            'funcionario.email_empresarial' => 'required|email|max:255|unique:funcionarios,email_empresarial', // Email único
            'funcionario.telefone_empresarial' => 'required|string|max:20',

            // Regras para os campos aninhados do modelo Medico (condicionais)
            // 'required_if:id_perfil,ID_DO_PERFIL_MEDICO'
            // Você precisará substituir ID_DO_PERFIL_MEDICO pelo ID real do perfil 'Medico' no seu banco de dados
            // ou buscar dinamicamente. Por simplicidade, usaremos 'sometimes' e validaremos a presença no controller.
            'medico.CRM' => 'sometimes|required|string|max:50|unique:medicos,CRM', // CRM único
            'medico.especialidade' => 'sometimes|required|string|max:255',
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
