<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    protected $fillable = [
        'reference',
        'date_evenement',
        'titre',
        'description',
        'adresse',
        'utilisateur_id',
        'type_evenement_id',
        'sous_type_evenement_id',
        'pays_id',
        'ville_id'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function typeEvenement()
    {
        return $this->belongsTo(TypeEvenement::class);
    }

    public function sousTypeEvenement()
    {
        return $this->belongsTo(SousTypeEvenement::class);
    }

    public function pay()
    {
        return $this->belongsTo(Pay::class);
    }

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }

    public function fichiers()
    {
        return $this->belongsToMany(Fichier::class, 'evenement_fichier');
    }
}
