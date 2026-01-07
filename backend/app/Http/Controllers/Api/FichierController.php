<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fichier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FichierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fichiers = Fichier::all();
        return response()->json($fichiers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'nullable|string|max:50',
            'path' => 'required|string|max:255'
        ]);

        $fichier = Fichier::create($validated);
        return response()->json($fichier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Fichier $fichier): JsonResponse
    {
        return response()->json($fichier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fichier $fichier): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'nullable|string|max:50',
            'path' => 'sometimes|required|string|max:255'
        ]);

        $fichier->update($validated);
        return response()->json($fichier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fichier $fichier): JsonResponse
    {
        $fichier->delete();
        return response()->json(null, 204);
    }
}
