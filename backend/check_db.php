<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Database Structure Check ===\n\n";

// Check villes table columns
echo "Villes table columns:\n";
$columns = Illuminate\Support\Facades\Schema::getColumnListing('villes');
foreach ($columns as $column) {
    echo "  - $column\n";
}
echo "\n";

// Check pays table columns  
echo "Pays table columns:\n";
$columns = Illuminate\Support\Facades\Schema::getColumnListing('pays');
foreach ($columns as $column) {
    echo "  - $column\n";
}
echo "\n";

// Check if villes table has pays_id column
if (Illuminate\Support\Facades\Schema::hasColumn('villes', 'pays_id')) {
    echo "✓ villes table has pays_id column\n";
} else {
    echo "✗ villes table missing pays_id column\n";
}

if (Illuminate\Support\Facades\Schema::hasColumn('villes', 'pay_id')) {
    echo "✓ villes table has pay_id column\n";
} else {
    echo "✗ villes table missing pay_id column\n";
}
