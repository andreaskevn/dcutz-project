import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DatePicker } from "@/Components/ui/date-picker";
import { DataTable } from "./data-table-layanans";
import { ColumnDef } from "@tanstack/react-table";
import { ClockCheck } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";

interface Layanan {
    id: string;
    nama_layanan: string;
    harga_layanan: number;
}

interface Status {
    status_name: "Diproses" | "Selesai";
}

interface Reservasi {
    id: string;
    nama_pelanggan: string;
    nomor_telepon_pelanggan: string;
    tanggal_reservasi: string;
    jam_reservasi: string;
    status_reservasi: string;
}

interface Props {
    reservasi: Reservasi;
    layanans: Layanan[];
    statuses: Status[];
    selectedLayananIds: string[];
}

export default function EditReservasi({
    reservasi,
    layanans,
    statuses,
    selectedLayananIds: initialSelectedIds,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_pelanggan: reservasi.nama_pelanggan || "",
        nomor_telepon_pelanggan: reservasi.nomor_telepon_pelanggan || "",
        status_reservasi: reservasi.status_reservasi || "Diproses",
        tanggal_reservasi: reservasi.tanggal_reservasi || "",
        jam_reservasi: reservasi.jam_reservasi || "",
        id_layanan: initialSelectedIds || [],
    });

    const [selectedLayananIds, setSelectedLayananIds] = useState<string[]>(initialSelectedIds);

    useEffect(() => {
        setData("id_layanan", selectedLayananIds);
    }, [selectedLayananIds]);

    const totalHarga = useMemo(() => {
        return layanans
            .filter((layanan) => selectedLayananIds.includes(layanan.id))
            .reduce((total, layanan) => total + (Number(layanan.harga_layanan) || 0), 0);
    }, [selectedLayananIds, layanans]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data reservasi yang akan dikirim:", data); 
        put(route("reservasi.update", reservasi.id));
    };

    const columns: ColumnDef<Layanan>[] = [
        { accessorKey: "nama_layanan", header: "Nama Layanan" },
        {
            accessorKey: "harga_layanan",
            header: "Harga",
            cell: (info) => `Rp ${(info.getValue() as number).toLocaleString()}`,
        },
    ];

    return (
        <Layout>
            <Head title="Edit Reservasi" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Edit Reservasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData("nama_pelanggan", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomor_telepon_pelanggan">Nomor Telepon</Label>
                                <Input
                                    id="nomor_telepon_pelanggan"
                                    type="number"
                                    value={data.nomor_telepon_pelanggan}
                                    onChange={(e) => setData("nomor_telepon_pelanggan", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_reservasi" className="block">Tanggal Reservasi</Label>
                                    <DatePicker
                                        value={data.tanggal_reservasi ? new Date(data.tanggal_reservasi) : null}
                                        onChange={(date) => {
                                            const formattedDate = date ? date.toISOString().split("T")[0] : "";
                                            setData("tanggal_reservasi", formattedDate);
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_reservasi">Jam Reservasi</Label>
                                    <Input
                                        type="time"
                                        id="jam_reservasi"
                                        step="1"
                                        value={data.jam_reservasi}
                                        onChange={(e) => setData("jam_reservasi", e.target.value)}
                                    />
                                </div>
                            </div>
                            

                            <div className="space-y-2">
                                <Label>Layanan</Label>
                                <DataTable
                                    columns={columns}
                                    data={layanans}
                                    selectedIds={selectedLayananIds}
                                    setSelectedIds={setSelectedLayananIds}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Status Reservasi</Label>
                                <Select
                                    onValueChange={(value) => setData("status_reservasi", value)}
                                    defaultValue={data.status_reservasi}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s.status_name} value={s.status_name}>
                                                {s.status_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1 text-right mt-4 pt-4 border-t">
                                <Label className="text-md font-medium">Total Harga</Label>
                                <div className="text-3xl font-bold">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(totalHarga)}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="outline" onClick={() => history.back()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Perbarui
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
