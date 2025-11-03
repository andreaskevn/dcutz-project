"use client";

import { useState, useEffect, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DataTable } from "./data-tables-users";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";


type Karyawan = {
    id: string;
    name: string;
    role: string;
    id_shift: string;
    shift: string;
};

interface Props {
    presensis: Karyawan[];
    shifts: { id: string; shift_name: string, start_time: string, end_time: string }[];
}

export default function CreatePresensi({ presensis, shifts }: Props) {
    // const { post, processing } = useForm();
    const [processing, setProcessing] = useState(false);
    const [selectedShift, setSelectedShift] = useState<string>(shifts[0]?.id ?? "");
    const [statusKehadiran, setStatusKehadiran] = useState<Record<string, string>>({});

    const filteredKaryawan = useMemo(() => {
        const filtered = presensis.filter(
            k => k.shift === selectedShift
        );

        const initialStatus: Record<string, string> = {};
        filtered.forEach(k => {
            if (!statusKehadiran[k.id]) initialStatus[k.id] = "Hadir";
        });
        setStatusKehadiran(prev => ({ ...prev, ...initialStatus }));

        return filtered;
    }, [selectedShift, presensis]);

    const handleChangeStatus = (id: string, value: string) => {
        setStatusKehadiran(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = filteredKaryawan.map(k => ({
            id_user: k.id,
            status: statusKehadiran[k.id],
        }));

        const toastId = toast.loading("Menyimpan presensi...");
        setProcessing(true);

        router.post(
            route("presensi.store"),
            { presensis: payload },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Presensi berhasil disimpan", {
                        id: toastId,
                        description: "Data kehadiran telah berhasil ditambahkan.",
                    });
                    // resetForm();
                },
                onError: () => {
                    toast.error("Gagal menyimpan presensi", {
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

    const columns: ColumnDef<Karyawan>[] = [
        { accessorKey: "name", header: "Nama Pegawai" },
        { accessorKey: "role", header: "Role" },
        {
            accessorKey: "shift",
            header: "Shift",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.shift);
                return shift?.shift_name ?? "-";
            },
        },
        {
            accessorKey: "start_time",
            header: "Jadwal Check In",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.shift);
                return shift?.start_time ?? "-";
            },
        },
        {
            id: "end_time",
            header: "Jadwal Check Out",
            cell: ({ row }) => {
                const shift = shifts.find(s => s.id === row.original.shift);
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

    return (
        <Layout>
            <Head title="Tambah Presensi" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Tambah Presensi</CardTitle>
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
                                    {shifts.map(shift => (
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
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
