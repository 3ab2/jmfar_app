<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Fichier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class EvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $evenements = Evenement::with([
            'utilisateur',
            'typeEvenement', 
            'sousTypeEvenement',
            'pay',
            'ville',
            'fichiers'
        ])->get();
        
        return response()->json($evenements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:50|unique:evenements',
            'date_evenement' => 'required|date',
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'nullable|string|max:500',
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'type_evenement_id' => 'required|exists:types_evenement,id',
            'sous_type_evenement_id' => 'nullable|exists:sous_types_evenement,id',
            'pays_id' => 'required|exists:pays,id',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $evenement = Evenement::create($validated);
        
        return response()->json(
            Evenement::with([
                'utilisateur',
                'typeEvenement', 
                'sousTypeEvenement',
                'pay',
                'ville',
                'fichiers'
            ])->find($evenement->id), 
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Evenement $evenement): JsonResponse
    {
        $evenement->load([
            'utilisateur',
            'typeEvenement', 
            'sousTypeEvenement',
            'pay',
            'ville',
            'fichiers'
        ]);
        
        return response()->json($evenement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evenement $evenement): JsonResponse
    {
        $validated = $request->validate([
            'reference' => 'sometimes|required|string|max:50|unique:evenements,reference,' . $evenement->id,
            'date_evenement' => 'sometimes|required|date',
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'nullable|string|max:500',
            'utilisateur_id' => 'sometimes|required|exists:utilisateurs,id',
            'type_evenement_id' => 'sometimes|required|exists:types_evenement,id',
            'sous_type_evenement_id' => 'nullable|exists:sous_types_evenement,id',
            'pays_id' => 'sometimes|required|exists:pays,id',
            'ville_id' => 'sometimes|required|exists:villes,id'
        ]);

        $evenement->update($validated);
        
        $evenement->load([
            'utilisateur',
            'typeEvenement', 
            'sousTypeEvenement',
            'pay',
            'ville',
            'fichiers'
        ]);
        
        return response()->json($evenement);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evenement $evenement): JsonResponse
    {
        $evenement->delete();
        return response()->json(null, 204);
    }

    /**
     * Upload files to an evenement.
     */
    public function uploadFiles(Request $request, Evenement $evenement): JsonResponse
    {
        $validated = $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|max:10240', // Max 10MB per file
        ]);

        $uploadedFiles = [];

        DB::transaction(function () use ($request, $evenement, &$uploadedFiles) {
            foreach ($request->file('files') as $file) {
                // Store file in storage/app/public/evenements/{evenement_id}
                $path = $file->store('evenements/' . $evenement->id, 'public');
                
                // Create fichier record
                $fichier = Fichier::create([
                    'date_upload' => now(),
                    'type' => $file->getClientMimeType(),
                    'path' => $path,
                ]);

                // Attach to evenement
                $evenement->fichiers()->attach($fichier->id);

                $uploadedFiles[] = [
                    'id' => $fichier->id,
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'url' => Storage::url($path)
                ];
            }
        });

        return response()->json([
            'message' => 'Files uploaded successfully',
            'files' => $uploadedFiles
        ], 201);
    }

    /**
     * Remove a file from an evenement.
     */
    public function removeFile(Evenement $evenement, Fichier $fichier): JsonResponse
    {
        // Check if file is attached to this evenement
        if (!$evenement->fichiers()->where('fichier_id', $fichier->id)->exists()) {
            return response()->json(['error' => 'File not attached to this evenement'], 404);
        }

        DB::transaction(function () use ($evenement, $fichier) {
            // Detach from evenement
            $evenement->fichiers()->detach($fichier->id);
            
            // Delete file from storage
            if (Storage::disk('public')->exists($fichier->path)) {
                Storage::disk('public')->delete($fichier->path);
            }
            
            // Delete fichier record
            $fichier->delete();
        });

        return response()->json(null, 204);
    }
}
