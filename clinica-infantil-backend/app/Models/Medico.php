<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'medicos';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_usuario',
        'CRM',
        'especialidade'
    ];

    // As colunas 'created_at' e 'updated_at' estão na sua tabela,
    // então ativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = true;

    /**
     * Define o relacionamento com a tabela Usuarios.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
