<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;
use App\Models\Shift;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['role', 'shift'])
            // ->select('id', 'name', 'email', 'id_role', 'id_shift')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->role_name : '-',
                    'shift' => $user->shift ? $user->shift->shift_name : '-',
                ];
            });
        return Inertia::render('Dashboard/ManajKaryawan/page', [
            'users' => $users->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        $roles = Role::select('id', 'role_name')->get();
        $shifts = Shift::select('id', 'shift_name')->get();

        return Inertia::render('Dashboard/ManajKaryawan/add', [
            'roles' => $roles,
            'shifts' => $shifts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'id_role' => 'required|exists:roles,id',
            'id_shift' => 'required|exists:shifts,id',
        ]);

        User::create([
            'id' => Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'id_role' => $validated['id_role'],
            'id_shift' => $validated['id_shift'],
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user, $id)
    {
        $user = User::findOrFail($id);
        $roles = Role::select('id', 'role_name')->get()->map(function ($role) {
            $role->id = (string) $role->id;
            return $role;
        });

        $shifts = Shift::select('id', 'shift_name')->get()->map(function ($shift) {
            $shift->id = (string) $shift->id;
            return $shift;
        });

        $user->id = (string) $user->id;
        $user->role_id = (string) $user->role_id;
        $user->shift_id = (string) $user->shift_id;

        return Inertia::render('Dashboard/ManajKaryawan/edit', [
            'user' => $user,
            'roles' => $roles,
            'shifts' => $shifts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'id_role' => 'required|exists:roles,id',
            'id_shift' => 'required|exists:shifts,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'id_role' => $validated['id_role'],
            'id_shift' => $validated['id_shift'],
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'Karyawan berhasil dihapus.');
    }
}
