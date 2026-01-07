<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $utilisateurs = Utilisateur::with('unite')->get();
        return response()->json($utilisateurs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|string|in:admin,user',
            'avatar' => 'nullable|string',
            'unite_id' => 'nullable|exists:unites,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        $data['mot_de_passe'] = Hash::make($data['mot_de_passe']);
        
        $utilisateur = Utilisateur::create($data);
        return response()->json($utilisateur->load('unite'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $utilisateur = Utilisateur::with('unite')->find($id);
        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur not found'], 404);
        }
        return response()->json($utilisateur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $utilisateur = Utilisateur::find($id);
        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:utilisateurs,email,'.$id,
            'mot_de_passe' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|string|in:admin,user',
            'avatar' => 'nullable|string',
            'unite_id' => 'nullable|exists:unites,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        if (isset($data['mot_de_passe'])) {
            $data['mot_de_passe'] = Hash::make($data['mot_de_passe']);
        }
        
        $utilisateur->update($data);
        return response()->json($utilisateur->load('unite'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $utilisateur = Utilisateur::find($id);
        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur not found'], 404);
        }
        
        $utilisateur->delete();
        return response()->json(['message' => 'Utilisateur deleted successfully']);
    }
}
