<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Creating Test Data ===\n\n";

try {
    // Get or create pay
    $pay = App\Models\Pay::where('code', 'TC')->first();
    if (!$pay) {
        $pay = App\Models\Pay::create([
            'nom' => 'Test Country',
            'code' => 'TC'
        ]);
        echo "✓ Pay created with ID: {$pay->id}\n";
    } else {
        echo "✓ Pay found with ID: {$pay->id}\n";
    }

    // Create ville
    $ville = App\Models\Ville::where('label', 'Test City')->first();
    if (!$ville) {
        $ville = App\Models\Ville::create([
            'label' => 'Test City',
            'pays_id' => $pay->id
        ]);
        echo "✓ Ville created with ID: {$ville->id}\n";
    } else {
        echo "✓ Ville found with ID: {$ville->id}\n";
    }

    echo "\nTest data ready!\n";
    echo "Pay ID: {$pay->id}\n";
    echo "Ville ID: {$ville->id}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
