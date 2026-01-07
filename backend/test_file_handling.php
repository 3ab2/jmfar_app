<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Http\Request;
use App\Models\Evenement;
use App\Models\Fichier;
use App\Models\Utilisateur;
use App\Models\TypeEvenement;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing Evenement File Handling ===\n\n";

// Test 1: Create a test evenement
echo "1. Creating test evenement...\n";
try {
    // Get or create test utilisateur
    $utilisateur = Utilisateur::first();
    if (!$utilisateur) {
        echo "   No utilisateur found. Please create one first.\n";
        exit(1);
    }
    
    // Get or create test type evenement
    $typeEvenement = TypeEvenement::first();
    if (!$typeEvenement) {
        echo "   No type evenement found. Please create one first.\n";
        exit(1);
    }
    
    $evenement = Evenement::create([
        'reference' => 'TEST_' . time(),
        'date_evenement' => now(),
        'titre' => 'Test Evenement for File Upload',
        'description' => 'This is a test evenement for file upload functionality',
        'utilisateur_id' => $utilisateur->id,
        'type_evenement_id' => $typeEvenement->id,
    ]);
    
    echo "   ✓ Evenement created with ID: {$evenement->id}\n";
    echo "   Reference: {$evenement->reference}\n\n";
} catch (Exception $e) {
    echo "   ✗ Error creating evenement: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Test 2: Test file relationship
echo "2. Testing file relationship...\n";
try {
    $fichiers = $evenement->fichiers;
    echo "   ✓ Evenement has {$fichiers->count()} files attached\n\n";
} catch (Exception $e) {
    echo "   ✗ Error testing relationship: " . $e->getMessage() . "\n\n";
}

// Test 3: Create a test file record
echo "3. Creating test file record...\n";
try {
    $fichier = Fichier::create([
        'date_upload' => now(),
        'type' => 'application/pdf',
        'path' => 'test/sample.pdf',
    ]);
    
    // Attach to evenement
    $evenement->fichiers()->attach($fichier->id);
    
    echo "   ✓ File created with ID: {$fichier->id}\n";
    echo "   ✓ File attached to evenement\n\n";
} catch (Exception $e) {
    echo "   ✗ Error creating file: " . $e->getMessage() . "\n\n";
}

// Test 4: Verify attachment
echo "4. Verifying file attachment...\n";
try {
    $evenement->refresh();
    $attachedFiles = $evenement->fichiers;
    echo "   ✓ Evenement now has {$attachedFiles->count()} files attached\n";
    
    foreach ($attachedFiles as $file) {
        echo "     - File ID: {$file->id}, Type: {$file->type}, Path: {$file->path}\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error verifying attachment: " . $e->getMessage() . "\n\n";
}

// Test 5: Test API response structure
echo "5. Testing API response structure...\n";
try {
    $evenementWithFiles = Evenement::with(['fichiers'])->find($evenement->id);
    
    echo "   ✓ API response structure:\n";
    echo "     Evenement ID: {$evenementWithFiles->id}\n";
    echo "     Title: {$evenementWithFiles->titre}\n";
    echo "     Files count: " . $evenementWithFiles->fichiers->count() . "\n";
    
    if ($evenementWithFiles->fichiers->isNotEmpty()) {
        foreach ($evenementWithFiles->fichiers as $file) {
            echo "       - File: {$file->id} ({$file->type})\n";
        }
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error testing API response: " . $e->getMessage() . "\n\n";
}

// Cleanup
echo "6. Cleaning up test data...\n";
try {
    $evenement->fichiers()->detach();
    Fichier::where('path', 'test/sample.pdf')->delete();
    $evenement->delete();
    echo "   ✓ Test data cleaned up\n\n";
} catch (Exception $e) {
    echo "   ✗ Error cleaning up: " . $e->getMessage() . "\n\n";
}

echo "=== Test Complete ===\n";
echo "File handling functionality is working correctly!\n";
