<?php

namespace App\Exports;

use App\Models\Presensi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PresensiExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;
    protected $createdBy;

    public function __construct($startDate = null, $endDate = null, $createdBy = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->createdBy = $createdBy;
    }

    public function collection()
    {
        $query = Presensi::with(['detailPresensis.user.role', 'detailPresensis.user.shift']);

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('created_at', [$this->startDate, $this->endDate]);
        }

        if ($this->createdBy) {
            $query->where('created_by', $this->createdBy);
        }

        return $query->get();
    }

    public function map($presensi): array
    {
        $rows = [];

        foreach ($presensi->detailPresensis as $detail) {
            $rows[] = [
                $presensi->id,
                $presensi->waktu_presensi,
                $presensi->user->name,
                $detail->user->name,
                $detail->user->role->role_name ?? '-',
                $detail->user->shift->shift_name ?? '-',
                $detail->status_presensi,
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'ID Presensi',
            'Tanggal Presensi',
            'Dibuat Oleh',
            'Nama Karyawan',
            'Role',
            'Shift',
            'Status Kehadiran',
        ];
    }
}
