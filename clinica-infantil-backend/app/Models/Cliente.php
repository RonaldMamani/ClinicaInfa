<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';
    protected $primaryKey = 'id';
    public $incrementing = true;

    protected $fillable = [
        'id_cidade',
        'id_genero',
        'cpf',
        'rg',
        'nome',
        'endereco',
        'ativo',
    ];

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    public $timestamps = true;

    public function cidade()
    {
        return $this->belongsTo(Cidade::class, 'id_cidade');
    }

    public function genero()
    {
        return $this->belongsTo(Genero::class, 'id_genero');
    }
}
