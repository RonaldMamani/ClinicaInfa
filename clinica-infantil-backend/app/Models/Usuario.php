<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    public $incrementing = true;

    protected $fillable = [
        'id_perfil',
        'id_funcionario',
        'username',
        'senha',
        'ativo'
    ];

    public $timestamps = false;

    protected $hidden = [
        'senha',
    ];
    
    public function medico()
    {
        return $this->hasOne(Medico::class, 'id_usuario');
    }
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