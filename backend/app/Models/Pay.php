<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pay extends Model
{
    protected $fillable = [
        'code',
        'nom'
    ];

    public function villes()
    {
        return $this->hasMany(Ville::class, 'pays_id');
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
