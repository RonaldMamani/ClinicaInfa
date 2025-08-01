<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'pacientes';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_cliente',
        'id_responsavel',
        'data_nascimento',
        'historico_medico'
    ];

    // Como a tabela 'pacientes' não tem as colunas 'created_at' e 'updated_at',
    // desativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = false;

    /**
     * Define o relacionamento com a tabela Clientes.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    /**
     * Define o relacionamento com a tabela Responsaveis.
     */
    public function responsavel()
    {
        return $this->belongsTo(Responsavel::class, 'id_responsavel');
    }

    public static function countPatients()
    {
        return self::count();
    }
}
