"use client";

import { useState, useEffect, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DataTable } from "../ManajKaryawan/data-tables";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

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
    shifts: { id: string; shift_name: string, start_time: string, end_time: string }[];
}

const getInitialStatus = (details: KaryawanDetail[]): Record<string, string> => {
    const statusMap: Record<string, string> = {};
    details.forEach(d => {
        statusMap[d.id] = d.status;
    });
    return statusMap;
};

export default function EditPresensi({ presensi, detailPresensis, shifts }: Props) {
    const [processing, setProcessing] = useState(false);

    const availableShiftsInBatch = useMemo(() => {
        const uniqueShiftIds = new Set(detailPresensis.map(k => k.id_shift));

        return shifts.filter(s => uniqueShiftIds.has(s.id));
    }, [detailPresensis, shifts]);

    const [selectedShift, setSelectedShift] = useState<string>(
        availableShiftsInBatch[0]?.id ?? ""
    );

    const filteredKaryawan = useMemo(() => {
        return detailPresensis.filter(
            k => k.id_shift === selectedShift
        );
    }, [selectedShift, detailPresensis]);

    const [statusKehadiran, setStatusKehadiran] = useState<Record<string, string>>(
        () => getInitialStatus(detailPresensis)
    );

    const handleChangeStatus = (id: string, value: string) => {
        setStatusKehadiran(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = filteredKaryawan.map(k => ({
            id_user: k.id,
            status: statusKehadiran[k.id],
        }));

        const toastId = toast.loading("Memperbarui presensi...");
        setProcessing(true);

        router.put(
            route("presensi.update", presensi.id),
            { presensis: payload },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Presensi berhasil diperbarui", {
                        id: toastId,
                        description: "Data kehadiran telah berhasil diperbarui.",
                    });
                },
                onError: () => {
                    toast.error("Gagal memperbarui presensi", {
                        id: toastId,
                        description: "Terjadi kesalahan, silakan coba lagi.",
                    });
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

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
            id: "status",
            header: "Status Kehadiran",
            cell: ({ row }) => {
                const k = row.original;
                return (
                    <Select
                        value={statusKehadiran[k.id]}
                        onValueChange={val => handleChangeStatus(k.id, val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hadir">Hadir</SelectItem>
                            <SelectItem value="Absen">Absen</SelectItem>
                        </SelectContent>
                    </Select>
                );
            },
        },
    ];

    const formattedDate = new Date(presensi.waktu_presensi).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return (
        <Layout>
            <Head title={`Edit Presensi - ${formattedDate}`} />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Edit Presensi
                        </CardTitle>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Pilih Shift</Label>
                                <RadioGroup
                                    value={selectedShift}
                                    onValueChange={setSelectedShift}
                                    className="flex space-x-4"
                                >
                                    {availableShiftsInBatch.map(shift => (
                                        <div key={shift.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={shift.id} id={`shift-${shift.id}`} />
                                            <Label htmlFor={`shift-${shift.id}`}>{shift.shift_name}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <p className="text-sm text-gray-600">
                                Menampilkan karyawan untuk Shift {shifts.find(s => s.id === selectedShift)?.shift_name}
                            </p>

                            <DataTable columns={columns} data={filteredKaryawan} />

                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => history.back()}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
