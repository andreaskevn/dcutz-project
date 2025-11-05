import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/Components/ui/card";

interface ConfirmPelangganProps {
    pelanggan: {
        id: string;
        nama_pelanggan: string;
        nomor_telepon_pelanggan: string;
    };
    message: string;
    formData: {
        nama_pelanggan: string;
        nomor_telepon_pelanggan: string;
        id_layanan: string[];
        id_user: string;
        tanggal_reservasi: string;
        jam_reservasi: string;
        // status_reservasi: string;
    };
}

export default function ConfirmPelanggan({ pelanggan, message, formData }: ConfirmPelangganProps) {
    const { post, processing, data, setData } = useForm({
        ...formData,
        confirmed: true,
    });

    const handleConfirm = () => {
        post(route("home.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Konfirmasi Pelanggan" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full shadow-xl rounded-xl p-6 bg-white">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Konfirmasi Pelanggan</h2>
                        <p className="text-gray-600">{message}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">Nama:</p>
                            <p className="text-gray-800">{pelanggan.nama_pelanggan}</p>
                        </div>
                        <div>
                            <p className="font-medium">Nomor Telepon:</p>
                            <p className="text-gray-800">{pelanggan.nomor_telepon_pelanggan}</p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between mt-4">
                        <Link href={route("home.index")}>
                            <Button variant="outline">Batal</Button>
                        </Link>
                        <Button onClick={handleConfirm} disabled={processing}>
                            Konfirmasi & Lanjutkan
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
