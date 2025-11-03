<?php

namespace App\Http\Controllers;

use App\Models\Reservasi;
use App\Models\Layanan;
use App\Models\DetailReservasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class ReservasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservasis = Reservasi::with('detail_reservasis.layanans')->get()->map(function ($reservasi) {
            return [
                'id' => $reservasi->id,
                'nama_pelanggan' => $reservasi->nama_pelanggan,
                'nomor_telepon_pelanggan' => $reservasi->nomor_telepon_pelanggan,
                'status_reservasi' => $reservasi->status_reservasi,
                'tanggal_reservasi' => $reservasi->tanggal_reservasi,
                'jam_reservasi' => $reservasi->jam_reservasi,
                'created_at' => $reservasi->created_at->format('Y-m-d H:i:s'),
                'layanans' => $reservasi->detail_reservasis->map(function ($detail) {
                    return $detail->layanans ? $detail->layanans->nama_layanan : null;
                })->filter()->values()->all(),
            ];
        });

        // $layanan = Layanan::all();
        return Inertia::render('Dashboard/ManajReservasi/page', [
            'reservasis' => $reservasis->toArray(),
            // 'layanans' => $layanan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $layanans = Layanan::select('id', 'nama_layanan', 'harga_layanan')->get();
        return Inertia::render('Dashboard/ManajReservasi/add', [
            'layanans' => $layanans,
            'statuses' => [
                ['status_name' => 'Diproses'],
                ['status_name' => 'Selesai'],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan'          => 'required|string|max:255',
            'nomor_telepon_pelanggan' => 'required|string|max:20',
            'tanggal_reservasi'       => 'required|date',
            'jam_reservasi'           => 'required|date_format:H:i:s',
            'id_layanan'              => 'required|array',
            'id_layanan.*'            => 'required|string|exists:layanans,id',
            'status_reservasi'        => 'required|in:Diproses,Selesai',
        ]);

        Log::info('Validated data:', $validated);

        DB::beginTransaction();

        try {
            $totalHarga = 0;
            foreach ($validated['id_layanan'] as $idLayanan) {
                $layanan = Layanan::find($idLayanan);
                if ($layanan) {
                    $totalHarga += $layanan->harga_layanan;
                }
            }

            Log::info('Total harga layanan:', ['total_harga' => $totalHarga]);

            $reservasiData = array_merge(
                $request->except('id_layanan'),
                [
                    'id' => Str::uuid(),
                    'total_harga' => $totalHarga,
                ]
            );

            $reservasi = Reservasi::create($reservasiData);
            Log::info('Reservasi berhasil dibuat:', $reservasi->toArray());

            foreach ($validated['id_layanan'] as $idLayanan) {
                $layanan = Layanan::find($idLayanan);

                $detail = DetailReservasi::create([
                    'id' => Str::uuid(),
                    'id_reservasi' => $reservasi->id,
                    'id_layanan' => $idLayanan,
                    'subtotal' => $layanan ? $layanan->harga_layanan : 0,
                ]);

                Log::info('DetailReservasi dibuat:', [
                    'id' => $detail->id,
                    'id_layanan' => $idLayanan,
                    'subtotal' => $layanan ? $layanan->harga_layanan : 0,
                ]);
            }

            DB::commit();
            Log::info('Transaksi berhasil di-commit.');

            return redirect()->route('reservasi.index')->with('success', 'Reservasi berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal menyimpan reservasi: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan. Reservasi gagal disimpan.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservasi $reservasi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $reservasi = Reservasi::with('detail_reservasis.layanans')->findOrFail($id);
        $layanans = Layanan::all();
        $statuses = [
            ['status_name' => 'Diproses'],
            ['status_name' => 'Selesai'],
        ];

        $selectedLayananIds = $reservasi->detail_reservasis->pluck('id_layanan')->toArray();
        Log::info('Layanan ditemukan:', $layanans->pluck('nama_layanan')->toArray());


        return inertia('Dashboard/ManajReservasi/edit', [
            'reservasi' => $reservasi,
            'layanans' => $layanans,
            'statuses' => $statuses,
            'selectedLayananIds' => $selectedLayananIds,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_pelanggan'          => 'required|string|max:255',
            'nomor_telepon_pelanggan' => 'required|string|max:20',
            'tanggal_reservasi'       => 'required|date',
            'jam_reservasi'           => 'required|date_format:H:i:s',
            'id_layanan'              => 'required|array|min:1',
            'id_layanan.*'            => 'required|string|exists:layanans,id',
            'status_reservasi'        => 'required|in:Diproses,Selesai',
        ]);

        Log::info('Validated update data:', $validated);

        DB::beginTransaction();

        try {
            $totalHarga = 0;
            foreach ($validated['id_layanan'] as $idLayanan) {
                $layanan = Layanan::find($idLayanan);
                if ($layanan) {
                    $totalHarga += $layanan->harga_layanan;
                }
            }

            Log::info('Total harga layanan (update):', ['total_harga' => $totalHarga]);

            $reservasi = Reservasi::findOrFail($id);

            $reservasi->update([
                'nama_pelanggan'          => $validated['nama_pelanggan'],
                'nomor_telepon_pelanggan' => $validated['nomor_telepon_pelanggan'],
                'tanggal_reservasi'       => $validated['tanggal_reservasi'],
                'jam_reservasi'           => $validated['jam_reservasi'],
                'status_reservasi'        => $validated['status_reservasi'],
                'total_harga'             => $totalHarga,
            ]);

            Log::info('Reservasi berhasil diupdate:', $reservasi->toArray());

            $reservasi->detail_reservasis()->delete();
            Log::info('Detail reservasi lama dihapus untuk reservasi ID: ' . $reservasi->id);

            foreach ($validated['id_layanan'] as $idLayanan) {
                $layanan = Layanan::find($idLayanan);

                $detail = DetailReservasi::create([
                    'id' => Str::uuid(),
                    'id_reservasi' => $reservasi->id,
                    'id_layanan' => $idLayanan,
                    'subtotal' => $layanan ? $layanan->harga_layanan : 0,
                ]);

                Log::info('DetailReservasi (update) dibuat:', [
                    'id' => $detail->id,
                    'id_layanan' => $idLayanan,
                    'subtotal' => $layanan ? $layanan->harga_layanan : 0,
                ]);
            }

            DB::commit();
            Log::info('Transaksi update berhasil di-commit untuk reservasi ID: ' . $reservasi->id);

            return redirect()->route('reservasi.index')->with('success', 'Reservasi berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui reservasi: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan. Reservasi gagal diperbarui.');
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $reservasi = Reservasi::findOrFail($id);

            Log::info('Proses hapus reservasi dimulai untuk ID:', ['id' => $id]);

            $deletedDetails = $reservasi->detail_reservasis()->delete();
            Log::info('Detail reservasi dihapus:', [
                'id_reservasi' => $id,
                'jumlah_detail_dihapus' => $deletedDetails
            ]);

            $reservasi->delete();
            Log::info('Reservasi berhasil dihapus:', ['id' => $id]);

            DB::commit();
            Log::info('Transaksi penghapusan berhasil di-commit untuk reservasi ID: ' . $id);

            return redirect()->route('reservasi.index')->with('success', 'Reservasi berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal menghapus reservasi: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return redirect()->back()->with('error', 'Terjadi kesalahan. Reservasi gagal dihapus.');
        }
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        Log::info('📂 File diterima:', [
            'hasFile' => $request->hasFile('file'),
            'fileName' => $request->file('file')?->getClientOriginalName(),
        ]);

        try {
            Log::info('Mulai parsing CSV...');
            $file = $request->file('file');
            $path = $file->getRealPath();

            $firstLine = fgets(fopen($path, 'r'));
            $delimiter = str_contains($firstLine, ';') ? ';' : ',';


            $rows = array_map(fn($line) => str_getcsv($line, $delimiter), file($path));
            $header = array_map('trim', array_shift($rows));

            Log::info('Header CSV:', $header);
            Log::info('Jumlah baris:', ['count' => count($rows)]);

            $requiredColumns = [
                'nama_pelanggan',
                'nomor_telepon_pelanggan',
                'tanggal_reservasi',
                'jam_reservasi',
                'status_reservasi',
                'nama_layanan'
            ];

            $missingColumns = array_diff($requiredColumns, $header);
            if (count($missingColumns) > 0) {
                return back()->with('error', 'Kolom berikut tidak ditemukan di file CSV: ' . implode(', ', $missingColumns));
            }

            DB::beginTransaction();

            foreach ($rows as $index => $row) {
                Log::info("🔹 Proses baris ke-" . ($index + 2), ['data' => $row]);
                $rowData = array_combine($header, $row);
                Log::info('RowData setelah combine:', $rowData);

                $validator = Validator::make($rowData, [
                    'nama_pelanggan' => 'required|string|max:255',
                    'nomor_telepon_pelanggan' => 'required|string|max:20',
                    'tanggal_reservasi' => 'required|date',
                    'jam_reservasi' => 'required|date_format:H:i:s',
                    'status_reservasi' => 'required|in:Diproses,Selesai',
                    'nama_layanan' => 'required|string',
                ]);

                if ($validator->fails()) {
                    DB::rollBack();
                    return back()->withErrors([
                        "Baris ke-" . ($index + 2) => implode(', ', $validator->errors()->all())
                    ]);
                }

                $namaLayananArray = array_map('trim', explode(',', $rowData['nama_layanan']));
                $layanans = Layanan::whereIn('nama_layanan', $namaLayananArray)->get();

                if ($layanans->count() !== count($namaLayananArray)) {
                    $notFound = array_diff(
                        $namaLayananArray,
                        $layanans->pluck('nama_layanan')->toArray()
                    );

                    DB::rollBack();
                    return back()->withErrors([
                        "Baris ke-" . ($index + 2) =>
                        "Layanan tidak ditemukan: " . implode(', ', $notFound)
                    ]);
                }

                $totalHarga = $layanans->sum('harga_layanan');

                $reservasi = Reservasi::create([
                    'id' => Str::uuid(),
                    'nama_pelanggan' => $rowData['nama_pelanggan'],
                    'nomor_telepon_pelanggan' => $rowData['nomor_telepon_pelanggan'],
                    'tanggal_reservasi' => $rowData['tanggal_reservasi'],
                    'jam_reservasi' => $rowData['jam_reservasi'],
                    'status_reservasi' => $rowData['status_reservasi'],
                    'total_harga' => $totalHarga,
                    'created_at' => now(),
                ]);

                foreach ($layanans as $layanan) {
                    DetailReservasi::create([
                        'id' => Str::uuid(),
                        'id_reservasi' => $reservasi->id,
                        'id_layanan' => $layanan->id,
                        'subtotal' => $layanan->harga_layanan,
                    ]);
                }
            }

            DB::commit();
            Log::info('Import CSV reservasi (search by name) berhasil disimpan.');

            return redirect()->route('reservasi.index')->with('success', 'Import CSV reservasi berhasil.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal import CSV reservasi (search by name): ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Terjadi kesalahan saat import CSV. ' . $e->getMessage());
        }
    }
}
