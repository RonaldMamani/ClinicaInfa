<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Responsavel extends Model
{
    use HasFactory;

    protected $table = 'responsaveis';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $fillable = [
        'id_cliente',
        'grau_parentesco',
        'email',
        'telefone'
    ];

    public $timestamps = false;
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
