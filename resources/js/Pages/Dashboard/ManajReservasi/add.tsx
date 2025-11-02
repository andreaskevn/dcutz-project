import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import TimePicker from "react-time-picker";
import React, { useState } from "react";
import { DatePicker } from "@/Components/ui/date-picker";
import { DataTable } from "./data-table-layanans";
import { ColumnDef } from "@tanstack/react-table";
import { ClockCheck } from "lucide-react";


interface Reservasi {
    id_layanan: string;
    nama_pelanggan: string;
    nomor_telepon_pelanggan: string;
    status_reservasi: string;
    tanggal_reservasi: string;
    jam_reservasi: string;
}

interface Layanan {
    id: string;
    nama_layanan: string;
    harga_layanan: number;
}

interface Status {
    status_name: 'Diproses' | 'Selesai';
}

interface Props {
    reservasis: Reservasi[];
    layanans: Layanan[];
    statuses: Status[];
}

export default function CreateReservasi({ reservasis, layanans, statuses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama_pelanggan: "",
        nomor_telepon_pelanggan: "",
        status_reservasi: "Diproses",
        tanggal_reservasi: "",
        jam_reservasi: "",
        id_layanan: [] as string[],
        total_harga: 0,
        subtotal: 0
    });
    const [tanggal, setTanggal] = useState<Date | null>(null);
    const [jam, setJam] = useState<string>("");
    const [selectedLayanan, setSelectedLayanan] = useState<string[]>([]);
    const [selectedLayananIds, setSelectedLayananIds] = useState<string[]>([]);

    React.useEffect(() => {
        setData('id_layanan', selectedLayananIds);
    }, [selectedLayananIds]);

    const totalHarga = React.useMemo(() => {
        return layanans
            .filter(layanan => selectedLayananIds.includes(layanan.id))
            .reduce((total, layanan) => total + (Number(layanan.harga_layanan) || 0), 0);
    }, [selectedLayananIds, layanans]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // console.log("Data reservasi yang akan dikirim:", data)

        post(route("reservasi.store"), {
            onSuccess: () => {
                setData("nama_pelanggan", "");
                setData("nomor_telepon_pelanggan", "");
                setData("status_reservasi", "Diproses");
                setData("tanggal_reservasi", "");
                setData("jam_reservasi", "");
                setData("id_layanan", []);
                setTanggal(null);
                setJam("");
                setSelectedLayananIds([]);
            }
        });
    };

    // const handleChangeStatus = (value: string) => {
    //     setData("status_reservasi", value);
    // }

    const columns: ColumnDef<Layanan>[] = [
        // { accessorKey: "id", header: "ID" },
        { accessorKey: "nama_layanan", header: "Nama Layanan" },
        { accessorKey: "harga_layanan", header: "Harga", cell: info => `Rp ${(info.getValue() as number).toLocaleString()}` },
    ];

    return (
        <Layout>
            <Head title="Tambah Karyawan" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Tambah Karyawan Baru</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData("nama_pelanggan", e.target.value)}
                                />
                                {errors.nama_pelanggan && <p className="text-sm">{errors.nama_pelanggan}</p>}
                            </div>

                            <div className="space-y-2 display: block;">
                                <Label htmlFor="nomor_telepon_pelanggan">Nomor Telepon Pelanggan</Label>
                                <Input
                                    id="nomor_telepon_pelanggan"
                                    type="number"
                                    placeholder="Masukkan nomor telepon"
                                    value={data.nomor_telepon_pelanggan}
                                    onChange={(e) => setData("nomor_telepon_pelanggan", e.target.value)}
                                />
                                {errors.nomor_telepon_pelanggan && <p className="text-sm">{errors.nomor_telepon_pelanggan}</p>}
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

                                    {/* Jika Anda punya error untuk tanggal, letakkan di sini.
          Contoh: {errors.tanggal_reservasi && <p className="text-sm text-red-500">{errors.tanggal_reservasi}</p>}
        */}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_reservasi">Jam Reservasi</Label>
                                    <Input
                                        type="time"
                                        id="jam_reservasi"
                                        step="1"
                                        // defaultValue="10:30:00"
                                        value={data.jam_reservasi}
                                        onChange={(e) => setData("jam_reservasi", (e.target.value))}
                                        className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        icon={<ClockCheck className="mr-2 h-4 w-4 text-muted-foreground" />}
                                    />

                                    {errors.jam_reservasi && (
                                        <p className="text-sm text-red-500">{errors.jam_reservasi}</p>
                                    )}
                                </div>

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_layanan">Layanan</Label>
                                <DataTable
                                    columns={columns}
                                    data={layanans}
                                    selectedIds={selectedLayananIds}
                                    setSelectedIds={setSelectedLayananIds}
                                />
                                {errors.id_layanan && <p className="text-sm">{errors.id_layanan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status_reservasi">Status Reservasi</Label>
                                <Select
                                    onValueChange={(value) => setData("status_reservasi", value)}
                                    defaultValue={data.status_reservasi}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih status reservasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.status_name} value={status.status_name}>
                                                {status.status_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status_reservasi && <p className="text-sm">{errors.status_reservasi}</p>}
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
