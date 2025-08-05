<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function pacientes(): HasMany
    {
        return $this->hasMany(Paciente::class, 'id_responsavel');
    }
}