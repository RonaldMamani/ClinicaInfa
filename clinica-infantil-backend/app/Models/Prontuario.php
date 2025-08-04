<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prontuario extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao modelo.
     *
     * @var string
     */
    protected $table = 'prontuarios';

    /**
     * Os atributos que podem ser preenchidos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'id_paciente',
        'id_medico',
        'data_diagnostico',
        'diagnostico',
        'prescricao',
        'observacoes',
    ];

    /**
     * Os atributos que devem ser convertidos em tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'data_diagnostico' => 'datetime',
    ];

    /**
     * Obtém o paciente associado ao prontuário.
     *
     * @return BelongsTo
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    /**
     * Obtém o médico associado ao prontuário.
     *
     * @return BelongsTo
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }
}
