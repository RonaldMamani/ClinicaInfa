<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'pagamentos';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_consulta',
        'valor',
        'metodo_pagamento',
        'data_pagamento'
    ];

    // As colunas 'created_at' e 'updated_at' estão na sua tabela,
    // então ativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = true;

    /**
     * Define o relacionamento com a tabela Consultas.
     */
    public function consulta()
    {
        return $this->belongsTo(Consulta::class, 'id_consulta');
    }
}
