<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fichier extends Model
{
    protected $fillable = [
        'date_upload',
        'type',
        'path'
    ];

    protected $casts = [
        'date_upload' => 'datetime',
    ];

    public function evenements()
    {
        return $this->belongsToMany(Evenement::class, 'evenement_fichier');
    }
}
