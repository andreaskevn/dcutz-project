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
import { toast } from "sonner";


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
    id_pelanggan: string;
    tanggal_reservasi: string;
    jam_reservasi: string;
    status_reservasi: string;
    id_user: string;
}

interface Props {
    reservasi: Reservasi;
    layanans: Layanan[];
    statuses: Status[];
    selectedLayananIds: string[];
    capster: User[];
    pelanggans: Pelanggan[];
}

interface User {
    id: string;
    name: string;
}

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
    nomor_telepon_pelanggan: string;
}

export default function EditReservasi({
    reservasi,
    layanans,
    statuses,
    selectedLayananIds: initialSelectedIds,
    capster,
    pelanggans
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id_pelanggan: reservasi.id_pelanggan || "",
        status_reservasi: reservasi.status_reservasi || "Diproses",
        tanggal_reservasi: reservasi.tanggal_reservasi || "",
        jam_reservasi: reservasi.jam_reservasi || "",
        id_layanan: initialSelectedIds || [],
        id_user: reservasi.id_user || "",
        nama_pelanggan: "",
        nomor_telepon_pelanggan: "",
    });
    const [selectedLayananIds, setSelectedLayananIds] = useState<string[]>(initialSelectedIds);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);


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

        const pelangganTerpilih = !!data.id_pelanggan;

        const pelangganBaruLengkap =
            !!data.nama_pelanggan && !!data.nomor_telepon_pelanggan;

        if (
            (!pelangganTerpilih && !pelangganBaruLengkap) ||
            !data.id_layanan.length ||
            !data.tanggal_reservasi ||
            !data.jam_reservasi
        ) {
            toast.warning("Harap lengkapi semua field sebelum menyimpan.");
            return;
        }

        const toastId = toast.loading("Memperbarui reservasi...");

        put(route("reservasi.update", reservasi.id), {
            preserveScroll: true,

            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Reservasi berhasil diperbarui", {
                    description: "Perubahan data reservasi telah disimpan.",
                });
            },

            onError: (errors) => {
                toast.dismiss(toastId);

                const firstError =
                    Object.values(errors)[0] ||
                    "Terjadi kesalahan saat memperbarui data reservasi.";

                toast.error("Gagal memperbarui reservasi", {
                    description: firstError as string,
                });
            },

            onFinish: () => {
                toast.dismiss(toastId);
            },
        });
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
                                <Label htmlFor="id_pelanggan">Pelanggan</Label>
                                {!isAddingNewCustomer ? (
                                    <>
                                        <Select
                                            onValueChange={(value) => setData("id_pelanggan", value)}
                                            defaultValue={data.id_pelanggan}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih pelanggan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pelanggans.map((pelanggan) => (
                                                    <SelectItem key={pelanggan.id} value={pelanggan.id}>
                                                        {pelanggan.nama_pelanggan} — {pelanggan.nomor_telepon_pelanggan}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() => {
                                                setIsAddingNewCustomer(true);
                                                setData("id_pelanggan", "");
                                                setData("nama_pelanggan", "");
                                                setData("nomor_telepon_pelanggan", "");
                                            }}
                                        >
                                            Tambah pelanggan baru
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            id="nama_pelanggan"
                                            placeholder="Nama pelanggan baru"
                                            value={data.nama_pelanggan}
                                            onChange={(e) => setData("nama_pelanggan", e.target.value)}
                                        />
                                        {errors.nama_pelanggan && (
                                            <p className="text-sm text-red-500">{errors.nama_pelanggan}</p>
                                        )}

                                        <Input
                                            id="nomor_telepon_pelanggan"
                                            placeholder="Nomor telepon"
                                            value={data.nomor_telepon_pelanggan}
                                            onChange={(e) => setData("nomor_telepon_pelanggan", e.target.value)}
                                        />
                                        {errors.nomor_telepon_pelanggan && (
                                            <p className="text-sm text-red-500">{errors.nomor_telepon_pelanggan}</p>
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() => {
                                                setIsAddingNewCustomer(false);
                                                setData("nama_pelanggan", "");
                                                setData("nomor_telepon_pelanggan", "");
                                            }}
                                        >
                                            Batal tambah pelanggan
                                        </Button>
                                    </>
                                )}
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
                                    {errors.tanggal_reservasi && <p className="text-sm text-red-500">{errors.tanggal_reservasi}</p>}
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
                                {errors.jam_reservasi && <p className="text-sm text-red-500">{errors.jam_reservasi}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_user">Capster</Label>
                                <Select
                                    onValueChange={(value) => setData("id_user", value)}
                                    defaultValue={data.id_user}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Capster" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {capster.map((capster) => (
                                            <SelectItem key={capster.id} value={capster.id}>
                                                {capster.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_user && <p className="text-sm">{errors.id_user}</p>}
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
