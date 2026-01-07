<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeEvenement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TypeEvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $types = TypeEvenement::with('sousTypes')->get();
        return response()->json($types);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100'
        ]);

        $type = TypeEvenement::create($validated);
        return response()->json($type, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TypeEvenement $type): JsonResponse
    {
        return response()->json($type->load('sousTypes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeEvenement $type): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:100'
        ]);

        $type->update($validated);
        return response()->json($type);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeEvenement $type): JsonResponse
    {
        $type->delete();
        return response()->json(null, 204);
    }
}
