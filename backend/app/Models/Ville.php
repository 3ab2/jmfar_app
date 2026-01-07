<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    protected $fillable = [
        'label',
        'pays_id'
    ];

    public function pay()
    {
        return $this->belongsTo(Pay::class, 'pays_id');
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
