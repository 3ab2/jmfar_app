<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeEvenement;
use App\Models\Utilisateur;
use App\Models\Unite;
use App\Models\Arme;
use App\Models\Pay;
use App\Models\Ville;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test type evenement
        TypeEvenement::firstOrCreate([
            'label' => 'Test Type'
        ]);

        // Create test arme
        $arme = Arme::firstOrCreate([
            'nom' => 'Test Weapon'
        ], [
            'description' => 'Test weapon for file handling'
        ]);

        // Create test unite
        $unite = Unite::firstOrCreate([
            'nom' => 'Test Unit'
        ], [
            'description' => 'Test unit for file handling',
            'arme_id' => $arme->id
        ]);

        // Create test pays
        $pay = Pay::firstOrCreate([
            'nom' => 'Test Country',
            'code' => 'TC'
        ]);

        // Create test ville
        $ville = Ville::firstOrCreate([
            'label' => 'Test City'
        ], [
            'pay_id' => $pay->id
        ]);
        
        // Create test utilisateur
        Utilisateur::firstOrCreate([
            'email' => 'test@example.com'
        ], [
            'nom' => 'Test User',
            'mot_de_passe' => bcrypt('password'),
            'role' => 'user',
            'unite_id' => $unite->id
        ]);

        $this->command->info('Test data created successfully!');
        $this->command->info("Pay ID: {$pay->id}, Ville ID: {$ville->id}");
    }
}
