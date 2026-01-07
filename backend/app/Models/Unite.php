<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unite extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'arme_id'
    ];

    public function arme()
    {
        return $this->belongsTo(Arme::class);
    }

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class);
    }
}
