<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeEvenement extends Model
{
    protected $table = 'types_evenement';
    
    protected $fillable = [
        'label'
    ];

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }

    public function sousTypes()
    {
        return $this->hasMany(SousTypeEvenement::class, 'type_evenement_id');
    }
}
