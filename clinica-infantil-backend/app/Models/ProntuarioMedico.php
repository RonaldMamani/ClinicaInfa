<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProntuarioMedico extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'prontuarios_medicos';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_paciente',
        'id_medico',
        'id_consulta',
        'data_diagnostico',
        'diagnostico',
        'prescricao',
        'observacoes'
    ];

    // Como a tabela 'prontuarios_medicos' não tem as colunas 'created_at' e 'updated_at',
    // desativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = false;

    /**
     * Define o relacionamento com a tabela Pacientes.
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    /**
     * Define o relacionamento com a tabela Medicos.
     */
    public function medico()
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }

    /**
     * Define o relacionamento com a tabela Consultas.
     */
    public function consulta()
    {
        return $this->belongsTo(Consulta::class, 'id_consulta');
    }
}
