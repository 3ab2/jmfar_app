<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    // Autoriser tous les champs en assignation massive
    protected $guarded = [];
    
    // Forcer le nom de la table si nécessaire
    protected $table = 'evenements';
    
    // Désactiver les timestamps si non utilisés
    public $timestamps = true;

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
