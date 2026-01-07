<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
        'avatar',
        'unite_id'
    ];

    protected $hidden = [
        'mot_de_passe'
    ];

    public function unite()
    {
        return $this->belongsTo(Unite::class);
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
