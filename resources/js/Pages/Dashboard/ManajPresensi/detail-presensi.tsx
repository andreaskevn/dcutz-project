"use client";

import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { DataTable } from "../ManajKaryawan/data-tables";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

type KaryawanDetail = {
    id: string;
    name: string;
    role: string;
    id_shift: string;
    status: string;
};

type Presensi = {
    id: string;
    waktu_presensi: string;
    created_by: string;
};

interface Props {
    presensi: Presensi;
    detailPresensis: KaryawanDetail[];
    shifts: { id: string; shift_name: string; start_time: string; end_time: string }[];
}

export default function DetailPresensi({ presensi, detailPresensis, shifts }: Props) {
    const uniqueShiftIds = Array.from(new Set(detailPresensis.map(k => k.id_shift)));
    const availableShiftsInBatch = shifts.filter(s => uniqueShiftIds.includes(s.id));

    const [selectedShift, setSelectedShift] = React.useState<string>(
        availableShiftsInBatch[0]?.id ?? ""
    );

    const filteredKaryawan = detailPresensis.filter(k => k.id_shift === selectedShift);

    const columns: ColumnDef<KaryawanDetail>[] = [
        { accessorKey: "name", header: "Nama Pegawai" },
        { accessorKey: "role", header: "Role" },
        {
            accessorKey: "id_shift",
            header: "Shift",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.id_shift);
                return shift?.shift_name ?? "-";
            },
        },
        {
            id: "start_time",
            header: "Jadwal Check In",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.id_shift);
                return shift?.start_time ?? "-";
            },
        },
        {
            id: "end_time",
            header: "Jadwal Check Out",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.id_shift);
                return shift?.end_time ?? "-";
            },
        },
        {
            accessorKey: "status",
            header: "Status Kehadiran",
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${row.original.status === "Hadir"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.original.status}
                </span>
            ),
        },
    ];

    const formattedDate = new Date(presensi.waktu_presensi).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
    });

    return (
        <Layout>
            <Head title={`Detail Presensi - ${formattedDate}`} />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Detail Presensi</CardTitle>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                        <p className="text-xs text-gray-500">Dibuat oleh: {presensi.created_by}</p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Pilih Shift</Label>
                                <RadioGroup
                                    value={selectedShift}
                                    onValueChange={setSelectedShift}
                                    className="flex space-x-4"
                                >
                                    {availableShiftsInBatch.map(shift => (
                                        <div key={shift.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={shift.id} id={`shift-${shift.id}`} disabled />
                                            <Label htmlFor={`shift-${shift.id}`}>{shift.shift_name}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <p className="text-sm text-gray-600">
                                Menampilkan karyawan untuk Shift{" "}
                                {shifts.find(s => s.id === selectedShift)?.shift_name}
                            </p>

                            <DataTable columns={columns} data={filteredKaryawan} />

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => history.back()}>
                                    Kembali
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
