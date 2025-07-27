<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cidade extends Model
{
    use HasFactory;

    protected $table = 'cidades';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = [
        'id_estado',
        'nome_cidade'
    ];

    /**
     * Define o relacionamento com a tabela Estados.
     */
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
