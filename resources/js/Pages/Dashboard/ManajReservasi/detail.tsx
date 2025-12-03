import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { router } from '@inertiajs/core'


interface Props {
    reservasi: {
        id: string;
        tanggal_reservasi: string;
        jam_reservasi: string;
        status_reservasi: string;
        total_harga: number;
    };
    pelanggan: {
        nama_pelanggan: string;
        nomor_telepon_pelanggan: string;
    };
    capster: {
        name: string;
    };
    layanans: {
        id: string;
        nama_layanan: string;
        harga_layanan: number;
        subtotal: number;
    }[];
}

export default function ShowReservasi({ reservasi, pelanggan, capster, layanans }: Props) {
    return (
        <Layout>
            <Head title="Detail Reservasi" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Detail Reservasi
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div>
                            <Label className="font-medium ">Pelanggan</Label>
                            <p className="text-lg font-semibold">
                                {pelanggan.nama_pelanggan}
                            </p>
                            <p>
                                {pelanggan.nomor_telepon_pelanggan}
                            </p>
                        </div>

                        <div>
                            <Label className="font-medium ">Capster</Label>
                            <p className="text-lg font-semibold">{capster.name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="font-medium ">Tanggal</Label>
                                <p>{reservasi.tanggal_reservasi}</p>
                            </div>
                            <div>
                                <Label className="font-medium ">Jam</Label>
                                <p>{reservasi.jam_reservasi}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="font-medium">Status</Label>
                            <p
                                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${reservasi.status_reservasi === "Selesai"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {reservasi.status_reservasi}
                            </p>
                        </div>

                        <div>
                            <Label className="font-medium  mb-2 block">
                                Layanan
                            </Label>
                            <table className="min-w-full border rounded-lg overflow-hidden">
                                <thead className=" text-left">
                                    <tr>
                                        <th className="p-2">Nama Layanan</th>
                                        <th className="p-2">Harga</th>
                                        <th className="p-2">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {layanans.map((layanan) => (
                                        <tr key={layanan.id} className="border-t">
                                            <td className="p-2">{layanan.nama_layanan}</td>
                                            <td className="p-2">
                                                Rp {layanan.harga_layanan.toLocaleString("id-ID")}
                                            </td>
                                            <td className="p-2 font-medium">
                                                Rp {layanan.subtotal.toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-right border-t pt-4">
                            <Label className="text-md font-medium">Total Harga</Label>
                            <div className="text-3xl font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(reservasi.total_harga)}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button variant="outline" onClick={() => router.visit(route('reservasi.index'))}>
                                Kembali
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
