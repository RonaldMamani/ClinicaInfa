<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consulta extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'consultas';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    protected $with = ['paciente', 'medico'];

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_paciente',
        'id_medico',
        'data_consulta',
        'hora_inicio',
        'hora_fim',
        'status',
        'descricao',
    ];

    // Como a tabela 'consultas' não tem as colunas 'created_at' e 'updated_at',
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
}
