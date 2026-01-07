<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Arme;
use App\Models\Unite;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create a default weapon first
        $arme = Arme::firstOrCreate(['nom' => 'Default Weapon']);
        
        // Create a default unit with the weapon
        $unite = Unite::firstOrCreate(
            ['nom' => 'Default Unit'],
            [
                'description' => 'Default unit description',
                'arme_id' => $arme->id
            ]
        );
        
        // Create a test user
        Utilisateur::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'nom' => 'Test User',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'admin',
                'unite_id' => $unite->id
            ]
        );
        
        echo "Test user created successfully!\n";
        echo "Email: test@example.com\n";
        echo "Password: password\n";
    }
}
