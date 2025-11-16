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
import { toast } from "sonner";
import dayjs from "dayjs";

interface Reservasi {
    id_layanan: string;
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

interface User {
    id: string;
    name: string;
}

interface Props {
    reservasis: Reservasi[];
    layanans: Layanan[];
    statuses: Status[];
    capster: User[];
    pelanggans: Pelanggan[]
}

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
    nomor_telepon_pelanggan: string;
}

export default function CreateReservasi({ reservasis, layanans, statuses, capster, pelanggans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_pelanggan: null as string | null,
        status_reservasi: "Diproses",
        tanggal_reservasi: "",
        jam_reservasi: "",
        id_layanan: [] as string[],
        total_harga: 0,
        subtotal: 0,
        id_user: "",
        nama_pelanggan: "",
        nomor_telepon_pelanggan: "",
    });
    const [selectedLayananIds, setSelectedLayananIds] = useState<string[]>([]);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

    React.useEffect(() => {
        setData('id_layanan', selectedLayananIds);
    }, [selectedLayananIds]);

    const totalHarga = React.useMemo(() => {
        let total = layanans
            .filter((layanan) => selectedLayananIds.includes(layanan.id))
            .reduce((sum, layanan) => sum + (Number(layanan.harga_layanan) || 0), 0);

        const selectedCapster = capster.find((c) => c.id === data.id_user);

        if (selectedCapster && selectedCapster.name.toLowerCase() === "agis") {
            total += 10000;
        }

        return total;
    }, [selectedLayananIds, layanans, data.id_user, capster]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("data yang akan dikirim:", data);

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
        const toastId = toast.loading("Adding reservation...");

        post(route("reservasi.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Reservasi berhasil disimpan", {
                    description: "Data reservasi telah berhasil ditambahkan.",
                });

                setData({
                    id_pelanggan: null,
                    status_reservasi: "Diproses",
                    tanggal_reservasi: "",
                    jam_reservasi: "",
                    id_layanan: [],
                    id_user: "",
                });
                setSelectedLayananIds([]);
            },
            onError: () => {
                toast.dismiss(toastId);
                const firstError =
                    Object.values(errors)[0] ||
                    "Terjadi kesalahan saat menambahkan reservasi.";

                toast.error("Gagal menyimpan reservasi", {
                    description: firstError as string,
                });
            },
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
            <Head title="Tambah Reservasi" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Tambah Reservasi Baru</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="id_pelanggan">Pelanggan</Label>
                                {!isAddingNewCustomer ? (
                                    <>
                                        <Select
                                            value={data.id_pelanggan ?? ""}
                                            onValueChange={(value) => setData("id_pelanggan", value)}
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
                                                setData("id_pelanggan", null);
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
                                        value={data.tanggal_reservasi ? dayjs(data.tanggal_reservasi).toDate() : null}
                                        onChange={(date) => {
                                            const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
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
                                        step="60"
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
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] text-black">
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
