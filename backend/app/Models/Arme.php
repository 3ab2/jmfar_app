<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arme extends Model
{
    protected $fillable = [
        'nom',
        'description'
    ];

    public function unites()
    {
        return $this->hasMany(Unite::class);
    }
}
