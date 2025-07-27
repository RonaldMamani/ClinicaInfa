<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    // Define o nome da tabela no banco de dados
    protected $table = 'usuarios';

    // Define a chave primária da tabela
    protected $primaryKey = 'id';

    // Indica que a chave primária é auto-incrementável
    public $incrementing = true;

    // Define os campos que podem ser preenchidos em massa (mass assignable)
    protected $fillable = [
        'id_perfil',
        'id_funcionario',
        'username',
        'senha', // Lembre-se que a senha deve ser HASHED antes de salvar!
        'ativo'
    ];

    // Como a tabela 'usuarios' não tem as colunas 'created_at' e 'updated_at',
    // desativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = false;

    // Oculta a senha ao serializar o modelo para JSON
    protected $hidden = [
        'senha',
    ];

    /**
     * Define o relacionamento com a tabela Perfis.
     */
    public function perfil()
    {
        return $this->belongsTo(Perfil::class, 'id_perfil');
    }

    /**
     * Define o relacionamento com a tabela Funcionarios.
     */
    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class, 'id_funcionario');
    }
}
