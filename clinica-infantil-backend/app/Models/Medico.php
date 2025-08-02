<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    use HasFactory;

    // A tabela 'medicos' tem as colunas 'id_usuario', 'CRM', 'especialidade'
    // e outras colunas que você possa ter.
    protected $fillable = [
        'id_usuario',
        'CRM',
        'especialidade',
        // Adicione outros campos preenchíveis aqui
    ];

    public $timestamps = false; // Supondo que você não tenha timestamps

    /**
     * Um médico pertence a um usuário.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
    
    /**
     * Um médico tem muitas consultas.
     */
    public function consultas()
    {
        return $this->hasMany(Consulta::class, 'id_medico', 'id');
    }
}
