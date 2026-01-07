<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SousTypeEvenement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SousTypeEvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $sousTypes = SousTypeEvenement::with('typeEvenement')->get();
        return response()->json($sousTypes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'type_evenement_id' => 'required|integer|exists:type_evenements,id'
        ]);

        $sousType = SousTypeEvenement::create($validated);
        return response()->json($sousType, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SousTypeEvenement $sousType): JsonResponse
    {
        return response()->json($sousType->load('typeEvenement'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SousTypeEvenement $sousType): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:100',
            'type_evenement_id' => 'sometimes|required|integer|exists:type_evenements,id'
        ]);

        $sousType->update($validated);
        return response()->json($sousType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SousTypeEvenement $sousType): JsonResponse
    {
        $sousType->delete();
        return response()->json(null, 204);
    }
}
