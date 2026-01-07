<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 50)->unique();
            $table->date('date_evenement');
            $table->string('titre', 150);
            $table->text('description')->nullable();
            $table->string('adresse', 255)->nullable();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs');
            $table->foreignId('type_evenement_id')->constrained('types_evenement');
            $table->foreignId('sous_type_evenement_id')->nullable()->constrained('sous_types_evenement');
            $table->foreignId('pays_id')->constrained('pays');
            $table->foreignId('ville_id')->constrained('villes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
