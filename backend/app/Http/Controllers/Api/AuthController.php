<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login user and return token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Identifiants incorrects',
                'error' => 'Invalid credentials'
            ], 401);
        }

        // Generate a simple token (in production, use Laravel Sanctum or JWT)
        $token = base64_encode($user->email . ':' . time());

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'unite_id' => $user->unite_id
            ]
        ]);
    }

    /**
     * Logout user (invalidate token)
     */
    public function logout(Request $request)
    {
        // In a real implementation, you would invalidate the token here
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        // This would typically be protected by auth middleware
        return response()->json([
            'message' => 'User profile',
            'user' => $request->user()
        ]);
    }
}
