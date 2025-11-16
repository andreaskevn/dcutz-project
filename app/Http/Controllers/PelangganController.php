<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pelanggans = Pelanggan::all();
        return Inertia::render('Dashboard/ManajPelanggan/page', [
            'pelanggans' => $pelanggans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/ManajPelanggan/add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'nomor_telepon_pelanggan' => 'required|string|max:20',
        ]);

        $validated['id'] = Str::uuid();
        Pelanggan::create($validated);

        return redirect()->route('pelanggan.index')->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pelanggan $pelanggan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $pelanggan = Pelanggan::findOrFail($id);
        return Inertia::render('Dashboard/ManajPelanggan/edit', [
            'pelanggan' => $pelanggan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pelanggan $pelanggan)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'nomor_telepon_pelanggan' => 'required|string|max:20',
        ]);

        $pelanggan->update($validated);

        return redirect()->route('pelanggan.index')->with('success', 'Pelanggan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pelanggan $pelanggan)
    {
        $pelanggan->delete();

        return redirect()->route('pelanggan.index')->with('success', 'Pelanggan berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        Log::info('📂 File diterima untuk import pelanggan', [
            'file' => $request->file('file')->getClientOriginalName(),
        ]);

        $path = $request->file('file')->getRealPath();

        // Deteksi delimiter otomatis (; atau ,)
        $firstLine = fgets(fopen($path, 'r'));
        $delimiter = str_contains($firstLine, ';') ? ';' : ',';

        // Parse CSV
        $rows = array_map(fn($line) => str_getcsv($line, $delimiter), file($path));

        $header = array_map('trim', array_shift($rows)); // Ambil header CSV

        Log::info('Header CSV:', $header);

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($rows as $row) {
            if (count($row) < count($header)) {
                $skipped++;
                continue;
            }

            $data = array_combine($header, $row);

            $nama  = trim($data['nama_pelanggan'] ?? '');
            $telp  = trim($data['nomor_telepon_pelanggan'] ?? '');

            // Skip jika nama kosong
            if (empty($nama)) {
                $skipped++;
                continue;
            }

            // Cek apakah pelanggan sudah ada berdasarkan nomor telepon
            $existing = Pelanggan::where('nomor_telepon_pelanggan', $telp)->first();

            if ($existing) {
                // Update jika sudah ada
                $existing->update([
                    'nama_pelanggan' => $nama,
                ]);

                $updated++;
                continue;
            }

            // Buat baru
            Pelanggan::create([
                'id'                        => Str::uuid(),
                'nama_pelanggan'            => $nama,
                'nomor_telepon_pelanggan'   => $telp,
            ]);

            $created++;
        }

        return redirect()
            ->route('pelanggan.index')
            ->with('success', "Import pelanggan selesai — Baru: {$created}, Update: {$updated}, Skip: {$skipped}");
    }
}
