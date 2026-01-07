<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SousTypeEvenement extends Model
{
    protected $table = 'sous_types_evenement';
    
    protected $fillable = [
        'label',
        'type_evenement_id'
    ];

    public function typeEvenement()
    {
        return $this->belongsTo(TypeEvenement::class);
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
