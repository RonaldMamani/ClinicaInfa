<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'perfis';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'nome_perfil',
        'descricao'
    ];

    // Como a tabela 'perfis' não tem as colunas 'created_at' e 'updated_at',
    // desativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = false;
}
