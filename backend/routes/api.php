<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArmeController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\PayController;
use App\Http\Controllers\Api\VilleController;
use App\Http\Controllers\Api\FichierController;
use App\Http\Controllers\Api\TypeEvenementController;
use App\Http\Controllers\Api\SousTypeEvenementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/ping', function () {
    return response()->json(['status' => 'ok']);
});

// API Resource Routes
Route::apiResource('armes', ArmeController::class);
Route::apiResource('utilisateurs', UtilisateurController::class);
Route::apiResource('evenements', EvenementController::class);
Route::post('evenements/{evenement}/files', [EvenementController::class, 'uploadFiles']);
Route::delete('evenements/{evenement}/files/{fichier}', [EvenementController::class, 'removeFile']);
Route::apiResource('pays', PayController::class);
Route::apiResource('villes', VilleController::class);
Route::apiResource('fichiers', FichierController::class);
Route::apiResource('types-evenement', TypeEvenementController::class);
Route::apiResource('sous-types-evenement', SousTypeEvenementController::class);
