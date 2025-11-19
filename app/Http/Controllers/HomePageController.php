<?php

namespace App\Http\Controllers;

use App\Models\Reservasi;
use App\Models\User;
use App\Models\Layanan;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use App\Models\DetailReservasi;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class HomePageController extends Controller
{
    public function index()
    {
        $layanans = Layanan::all();

        $capsters = User::select('users.id', 'users.name')
            ->join('roles', 'roles.id', '=', 'users.id_role')
            ->where('roles.role_name', 'Capster')
            ->get();
        return Inertia::render('Welcome', [
            'layanans' => $layanans,
            'capsters' => $capsters,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'nomor_telepon_pelanggan' => 'required|string|max:20',
            'id_layanan' => 'required|array',
            'id_layanan.*' => 'exists:layanans,id',
            'id_user' => 'required|exists:users,id',
            'tanggal_reservasi' => 'required|date',
            'jam_reservasi' => 'required|date_format:H:i',
        ]);

        $pelanggan = Pelanggan::where('nomor_telepon_pelanggan', $validated['nomor_telepon_pelanggan'])->first();

        if ($pelanggan) {
            if ($request->nama_pelanggan != $pelanggan->nama_pelanggan) {
                return back()->withErrors([
                    'nomor_telepon_pelanggan' => 'Nomor telepon sudah terdaftar dengan nama berbeda.',
                ])->withInput();
            }
        }
        if ($pelanggan && !$request->boolean('confirmed')) {
            return Inertia::render('ConfirmPelanggan', [
                'pelanggan' => $pelanggan,
                'formData' => $validated,
                'message' => 'Pelanggan sudah terdaftar. Konfirmasi diperlukan.'
            ]);
        }

        $existingReservasi = Reservasi::where('id_user', $validated['id_user'])
            ->whereDate('tanggal_reservasi', $validated['tanggal_reservasi'])
            ->whereTime('jam_reservasi', $validated['jam_reservasi'])
            ->first();

        if ($existingReservasi) {
            return back()->withErrors([
                'jam_reservasi' => 'Sudah ada reservasi pada tanggal dan jam ini untuk capster yang dipilih.',
            ])->withInput();
        }

        $pelanggan = Pelanggan::create([
            'id' => Str::uuid(),
            'nama_pelanggan' => $validated['nama_pelanggan'],
            'nomor_telepon_pelanggan' => $validated['nomor_telepon_pelanggan'],
        ]);

        $totalHarga = Layanan::whereIn('id', $validated['id_layanan'])->sum('harga_layanan');

        $reservasi = Reservasi::create([
            'id' => Str::uuid(),
            'id_user' => $validated['id_user'],
            'id_pelanggan' => $pelanggan->id,
            'tanggal_reservasi' => $validated['tanggal_reservasi'],
            'jam_reservasi' => $validated['jam_reservasi'],
            'status_reservasi' => 'Diproses',
            'total_harga' => $totalHarga,
            'status_reservasi' => 'Diproses',
        ]);

        foreach ($validated['id_layanan'] as $idLayanan) {
            $layanan = Layanan::find($idLayanan);
            DetailReservasi::create([
                'id' => Str::uuid(),
                'id_reservasi' => $reservasi->id,
                'id_layanan' => $idLayanan,
                'subtotal' => $layanan->harga_layanan,
            ]);
        }

        return redirect()->route('home.index')->with('success', 'Reservasi berhasil ditambahkan.');
    }

    public function checkPelanggan(Request $request)
    {
        $pelanggan = Pelanggan::where('nomor_telepon_pelanggan', $request->nomor_telepon_pelanggan)->first();

        if ($pelanggan) {
            return Inertia::render('ConfirmPelanggan', [
                'pelanggan' => $pelanggan,
                'message' => 'Pelanggan sudah terdaftar. Konfirmasi diperlukan.'
            ]);
        }

        return response()->json(['status' => 'not_found']);
    }
}
