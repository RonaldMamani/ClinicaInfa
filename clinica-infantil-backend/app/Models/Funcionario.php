<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    use HasFactory;

    protected $table = 'funcionarios';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $fillable = [
        'nome',
        'cpf',
        'cargo',
        'email_empresarial',
        'telefone_empresarial'
    ];

    // desativamos o gerenciamento automático de timestamps do Eloquent.
    public $timestamps = false;
}
