<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Shift;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\DetailPresensi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PresensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $presensis = Presensi::with(['user', 'detailPresensis.shift'])->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'waktu_presensi' => $p->waktu_presensi,
                'created_by' => $p->created_by,
                'created_at' => $p->created_at,
            ];
        });
        return Inertia::render('Dashboard/ManajPresensi/page', [
            'presensis' => $presensis->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $shifts = Shift::all()->map(function ($shift) {
            return [
                'id' => (string) $shift->id,
                'shift_name' => $shift->shift_name,
                'start_time' => $shift->start_time,
                'end_time' => $shift->end_time,
            ];
        });

        $presensis = User::with('shift')
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'Capster');
            })
            ->get()
            ->map(function ($user) {
                return [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'role' => 'Capster',
                    'shift' => $user->id_shift,
                ];
            });

        return Inertia::render('Dashboard/ManajPresensi/add', [
            'presensis' => $presensis->toArray(),
            'shifts' => $shifts->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'presensis' => 'present|array',
            'presensis.*.id_user' => 'required|string|exists:users,id',
            'presensis.*.status' => ['required', 'string', Rule::in(['Hadir', 'Absen'])],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validatedData = $validator->validated();

        if (empty($validatedData['presensis'])) {
            return redirect()->route('presensi.index')->with('info', 'Tidak ada karyawan untuk diabsen pada shift tersebut.');
        }

        $presensi = Presensi::create([
            'id' => Str::uuid(),
            'waktu_presensi' => now(),
            'created_by' => Auth::user()->name,
        ]);

        $dataToInsert = [];
        foreach ($validatedData['presensis'] as $item) {
            $dataToInsert[] = [
                'id' => Str::uuid(),
                'id_presensi' => $presensi->id,
                'id_user' => $item['id_user'],
                'status_presensi' => $item['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DetailPresensi::insert($dataToInsert);

        return redirect()->route('presensi.index')->with('success', 'Data presensi berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Presensi $presensi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $shifts = Shift::all()->map(function ($shift) {
            return [
                'id' => (string) $shift->id,
                'shift_name' => $shift->shift_name,
                'start_time' => $shift->start_time,
                'end_time' => $shift->end_time,
            ];
        });

        $presensi = Presensi::findOrFail($id);
        $detailPresensis = DetailPresensi::with(['user.role', 'user.shift'])
            ->where('id_presensi', $id)
            ->whereHas('user.role', function ($query) {
                $query->where('role_name', 'Capster');
            })
            ->get()
            ->map(function ($detail) {
                return [
                    'id' => (string) $detail->user->id,
                    'name' => $detail->user->name,
                    'role' => 'Capster',
                    'id_shift' => (string) $detail->user->id_shift,
                    'status' => $detail->status_presensi,
                ];
            });

        return Inertia::render('Dashboard/ManajPresensi/edit', [
            'presensi' => $presensi,
            'detailPresensis' => $detailPresensis->toArray(),
            'shifts' => $shifts->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'presensis' => 'present|array',
            'presensis.*.id_user' => 'required|string|exists:users,id',
            'presensis.*.status' => ['required', 'string', Rule::in(['Hadir', 'Absen'])],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validatedData = $validator->validated();

        if (empty($validatedData['presensis'])) {
            return redirect()->back()->with('info', 'Tidak ada data untuk diperbarui.');
        }

        DB::transaction(function () use ($validatedData, $id) {
            foreach ($validatedData['presensis'] as $item) {
                DetailPresensi::where('id_presensi', $id)
                    ->where('id_user', $item['id_user'])
                    ->update([
                        'status_presensi' => $item['status'],
                        'updated_at' => now(),
                    ]);
            }

            Presensi::findOrFail($id)->touch();
        });

        return redirect()->route('presensi.index')->with('success', 'Data presensi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $presensi = Presensi::findOrFail($id);

        DB::transaction(function () use ($presensi, $id) {

            DetailPresensi::where('id_presensi', $id)->delete();

            $presensi->delete();
        });

        return redirect()->route('presensi.index')->with('success', 'Data presensi berhasil dihapus.');
    }

    public function importStore(Request $request)
    {
        $request->validate(
            [
                'file' => [
                    'required',
                    'file',
                    'mimetypes:text/csv,text/plain,application/csv,application/vnd.ms-excel'
                ]
            ],
            [
                'file.required' => 'File CSV wajib diunggah.',
                'file.mimetypes' => 'Format file tidak valid. Harap unggah file .csv atau .txt yang benar.'
            ]
        );

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        $handle = fopen($filePath, 'r');
        if (!$handle) {
            return redirect()->back()->with('error', 'Gagal membuka file CSV.');
        }

        DB::beginTransaction();
        try {
            $presensi = Presensi::create([
                'id' => Str::uuid(),
                'waktu_presensi' => now(),
                'created_by' => Auth::user()->name,
            ]);

            $dataToInsert = [];
            $errors = [];
            $rowNumber = 1;
            $headerSkipped = false;

            while (($row = fgetcsv($handle, 1000, ';')) !== FALSE) {
                if (!$headerSkipped) {
                    $headerSkipped = true;
                    $rowNumber++;
                    continue;
                }

                // Asumsi: Kolom 0 = email_karyawan, Kolom 1 = status
                $email = $row[0] ?? null;
                $status = $row[1] ?? null;

                // A. Cek kelengkapan data
                if (empty($email) || empty($status)) {
                    $errors[] = "Baris $rowNumber: Data tidak lengkap (email atau status kosong).";
                    $rowNumber++;
                    continue;
                }

                // B. Cek status
                $validStatus = ['Hadir', 'Absen'];
                if (!in_array($status, $validStatus)) {
                    $errors[] = "Baris $rowNumber: Status '$status' tidak valid. Gunakan 'Hadir' atau 'Absen'.";
                    $rowNumber++;
                    continue;
                }

                // C. Cari user berdasarkan email
                $user = User::where('email', $email)->first();
                if (!$user) {
                    $errors[] = "Baris $rowNumber: Karyawan dengan email '$email' tidak ditemukan.";
                    $rowNumber++;
                    continue;
                }

                // D. Kumpulkan data valid untuk di-insert
                $dataToInsert[] = [
                    'id' => Str::uuid(),
                    'id_presensi' => $presensi->id,
                    'id_user' => $user->id,
                    'status_presensi' => $status,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $rowNumber++;
            }
            fclose($handle);

            // 5. Cek apakah ada error validasi
            if (!empty($errors)) {
                DB::rollBack();
                return redirect()->back()->withErrors($errors);
            }

            // 6. Cek jika file valid tapi tidak ada data
            if (empty($dataToInsert)) {
                DB::rollBack();
                return redirect()->back()->with('info', 'File CSV tidak berisi data yang valid untuk diimpor.');
            }

            // 7. Insert data ke DB dan commit
            DetailPresensi::insert($dataToInsert);
            DB::commit();

            return redirect()->route('presensi.index')->with('success', 'Data presensi berhasil diimpor.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan server: ' . $e->getMessage());
        }
    }
}
