<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;
use App\Models\Shift;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

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
                    'email' => $user->email ? $user->email : '-',
                    'role' => $user->role ? $user->role->role_name : '-',
                    'shift' => $user->shift ? $user->shift->shift_name : '-',
                ];
            });
        $roles = Role::select('id', 'role_name')->get();
        $shifts = Shift::select('id', 'shift_name')->get();
        return Inertia::render('Dashboard/ManajKaryawan/page', [
            'users' => $users->toArray(),
            'roles' => $roles->toArray(),
            'auth' => [
                'user' => Auth::user(),
                'role' => Auth::user()->role ? Auth::user()->role->role_name : null,
            ],
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
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'nullable|sometimes|required_with:email|min:8',
            'id_role' => 'required|exists:roles,id',
            'id_shift' => 'required|exists:shifts,id',
        ]);

        User::create([
            'id' => Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'password' => !empty($validated['password'])
                ? Hash::make($validated['password'])
                : null,
            'id_role' => $validated['id_role'],
            'id_shift' => $validated['id_shift'],
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'Successfully adding users');
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
            'email' => 'nullable|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required_with:email|min:8',
            'id_role' => 'required|exists:roles,id',
            'id_shift' => 'required|exists:shifts,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'id_role' => $validated['id_role'],
            'id_shift' => $validated['id_shift'],
            'password' => !empty($validated['password'])
                ? Hash::make($validated['password'])
                : $user->password,
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
            ->with('success');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        Log::info('📂 File diterima:', [
            'hasFile' => $request->hasFile('file'),
            'fileName' => $request->file('file')?->getClientOriginalName(),
        ]);

        Log::info('Mulai parsing CSV...');
        $path = $request->file('file')->getRealPath();
        $firstLine = fgets(fopen($path, 'r'));
        $delimiter = str_contains($firstLine, ';') ? ';' : ',';

        $rows = array_map(fn($line) => str_getcsv($line, $delimiter), file($path));
        $header = array_map('trim', array_shift($rows));

        Log::info('Header CSV:', $header);
        Log::info('Jumlah baris:', ['count' => count($rows)]);
        Log::info('Header CSV:', $header);
        unset($rows[0]);

        $created = 0;
        $skipped = 0;

        foreach ($rows as $row) {
            $data = array_combine($header, $row);

            $name     = trim($data['name'] ?? '');
            $email    = trim($data['email'] ?? '');
            $password = trim($data['password'] ?? '');
            $roleName = trim($data['role'] ?? '');
            $shiftName = trim($data['shift'] ?? '');

            if (empty($name)) {
                $skipped++;
                continue;
            }

            $role = Role::where('role_name', $roleName)->first();
            if (!$role) {
                Log::warning("Role '{$roleName}' tidak ditemukan untuk user {$name}");
                $skipped++;
                continue;
            }

            $shift = Shift::where('shift_name', $shiftName)->first();
            if (!$shift) {
                Log::warning("Shift '{$shiftName}' tidak ditemukan untuk user {$name}");
                $skipped++;
                continue;
            }

            if (!empty($email) && User::where('email', $email)->exists()) {
                Log::info("Email {$email} sudah ada, dilewati.");
                $skipped++;
                continue;
            }

            User::create([
                'id'        => Str::uuid(),
                'name'      => $name,
                'email'     => $email ?: null,
                'password'  => $email ? Hash::make($password ?: 'password123') : null,
                'id_role'   => $role->id,
                'id_shift'  => $shift->id,
            ]);

            $created++;
        }

        return redirect()
            ->route('users.index')
            ->with('success', "Import users: {$created} data success, {$skipped} skipped");
    }
}
