<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProntuarioStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Altere para a lógica de autorização necessária, como verificar se o
        // usuário tem permissão para criar prontuários.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'id_paciente' => ['required', 'integer', 'exists:pacientes,id'],
            'descricao' => ['required', 'string'],
        ];
    }
}
