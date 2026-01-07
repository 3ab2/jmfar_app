<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ville;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VilleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $villes = Ville::with('pay')->get();
        return response()->json($villes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'pays_id' => 'required|exists:pays,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $ville = Ville::create($request->all());
        return response()->json($ville->load('pay'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ville = Ville::with('pay')->find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville not found'], 404);
        }
        return response()->json($ville);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|required|string|max:255',
            'pays_id' => 'sometimes|required|exists:pays,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $ville->update($request->all());
        return response()->json($ville->load('pay'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville not found'], 404);
        }
        
        $ville->delete();
        return response()->json(['message' => 'Ville deleted successfully']);
    }
}
