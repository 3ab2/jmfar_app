<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Arme;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArmeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $armes = Arme::with('unites')->get();
        return response()->json($armes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string'
        ]);

        $arme = Arme::create($validated);
        return response()->json($arme, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Arme $arme): JsonResponse
    {
        return response()->json($arme->load('unites'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Arme $arme): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string'
        ]);

        $arme->update($validated);
        return response()->json($arme);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Arme $arme): JsonResponse
    {
        $arme->delete();
        return response()->json(null, 204);
    }
}
