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
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('email', 150)->unique();
            $table->string('mot_de_passe');
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->string('avatar', 255)->nullable();
            $table->foreignId('unite_id')->constrained('unites');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
