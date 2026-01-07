<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pays = Pay::with('villes')->get();
        return response()->json($pays);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:10|unique:pays,code',
            'nom' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pay = Pay::create($request->all());
        return response()->json($pay->load('villes'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pay = Pay::with('villes')->find($id);
        if (!$pay) {
            return response()->json(['message' => 'Pay not found'], 404);
        }
        return response()->json($pay);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pay = Pay::find($id);
        if (!$pay) {
            return response()->json(['message' => 'Pay not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|required|string|max:10|unique:pays,code,'.$id,
            'nom' => 'sometimes|required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pay->update($request->all());
        return response()->json($pay->load('villes'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pay = Pay::find($id);
        if (!$pay) {
            return response()->json(['message' => 'Pay not found'], 404);
        }
        
        $pay->delete();
        return response()->json(['message' => 'Pay deleted successfully']);
    }
}
