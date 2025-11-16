<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Presensi;
use App\Models\Reservasi;
use App\Models\DetailReservasi;
use App\Models\DetailPresensi;

class DashboardController extends Controller
{
    public function index()
    {
        $month = now()->month;

        $topEmployee = DetailPresensi::select('id_user', DB::raw('COUNT(*) as total'))
            ->whereMonth('created_at', $month)
            ->where('status_presensi', 'Hadir')
            ->whereHas('user.role', function ($q) {
                $q->where('role_name', 'Capster');
            })
            ->groupBy('id_user')
            ->with('user:id,name,id_role', 'user.role:id,role_name')
            ->orderByDesc('total')
            ->first();

        $status = DetailPresensi::where('id_user', $topEmployee->id_user)
            ->whereMonth('created_at', $month)
            ->orderBy('created_at', 'desc')
            ->value('status_presensi');

        $topEmployeeData = $topEmployee ? [
            'name' => $topEmployee->user->name,
            'total' => $topEmployee->total,
            'role' => $topEmployee->user->role->role_name,
            'status' => $status,
        ] : null;

        $topKapter = Reservasi::select('id_user', DB::raw('COUNT(*) as total'))
            ->whereMonth('created_at', $month)
            ->groupBy('id_user')
            ->with('user:id,name')
            ->orderByDesc('total')
            ->first();

        $topKapterData = $topKapter ? [
            'name' => $topKapter->user->name,
            'total' => $topKapter->total,
        ] : null;

        $today = now()->toDateString();

        $capsterChart = Reservasi::select('id_user', DB::raw('COUNT(*) as total'))
            ->whereMonth('created_at', $month)
            ->whereHas('user.role', function ($q) {
                $q->where('role_name', 'Capster');
            })
            ->groupBy('id_user')
            ->with('user:id,name')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->user->name,
                    'total' => $item->total,
                ];
            });

        $layananTop = DetailReservasi::select('id_layanan', DB::raw('COUNT(*) as total'))
            ->whereMonth('created_at', $month)
            ->groupBy('id_layanan')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->layanans->nama_layanan,
                    'total' => $item->total,
                ];
            });

        return Inertia::render('Dashboard/page', [
            'topEmployee' => $topEmployeeData,
            'topKapter' => $topKapterData,
            'totalReservasiToday' => Reservasi::whereDate('created_at', $today)->count(),
            'totalReservasiMonth' => Reservasi::whereMonth('created_at', $month)->count(),
            'capsterChart' => $capsterChart,
            'layananTop' => $layananTop
        ]);
    }
}
