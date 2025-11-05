"use client";

import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useForm } from "@inertiajs/react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { toast, Toaster } from "sonner";
import { router } from '@inertiajs/react';

interface Layanan {
    id: string;
    nama_layanan: string;
    harga_layanan: number;
}

interface Capster {
    id: string;
    name: string;
}

interface Auth {
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
}

interface HomeProps {
    layanans: Layanan[];
    capsters: Capster[];
    auth: Auth;
}

export default function Home({ layanans, capsters, auth }: HomeProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pelanggan: "",
        nomor_telepon_pelanggan: "",
        id_layanan: [] as string[],
        id_user: "",
        tanggal_reservasi: "",
        jam_reservasi: "",
        id_pelanggan: "",
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [existingPelanggan, setExistingPelanggan] = useState<any>(null);

    const handleChange = (key, value) => setData(key, value);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("clicked")
        if (
            !data.nama_pelanggan ||
            !data.nomor_telepon_pelanggan ||
            !data.id_layanan.length ||
            !data.tanggal_reservasi ||
            !data.jam_reservasi
        ) {
            toast.warning("Harap lengkapi semua field sebelum menyimpan.");
            return;
        }

        router.post(route('home.store'), {
            ...data,
        }, {
            onSuccess: (response) => {
                console.log(response);
            },
            onError: (errors) => {
                Object.values(errors).forEach((errMsg) => {
                    toast.error(errMsg);
                });
            },
        });
    };

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm">
                <div className="max-w-3md mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">
                        Dcut’z Barbershop
                    </h1>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg transition"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <Toaster position="top-center" richColors />

            {/* Hero Section */}
            <section
                className="relative h-[400px] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1400&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-black/50 absolute inset-0" />
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Selamat Datang di{" "}
                        <span className="text-primary">Dcut’z Barbershop</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        Penampilan terbaik dimulai dari potongan rambut terbaik.
                        Yuk, reservasi sekarang juga!
                    </p>
                </div>
            </section>

            {/* Layanan Section */}
            <section className="py-12 px-6 md:px-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Layanan Kami
                </h2>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6 px-6">
                        {layanans.map((layanan) => (
                            <Card
                                key={layanan.id}
                                className="flex-[0_0_80%] md:flex-[0_0_30%] bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {layanan.nama_layanan}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-2">
                                        Harga: Rp{" "}
                                        {Number(
                                            layanan.harga_layanan
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Reservasi */}
            <section className="py-12 px-6 md:px-12 bg-white">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Form Reservasi
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto space-y-4 bg-gray-50 p-6 rounded-xl shadow-md"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Nama Pelanggan</Label>
                            <Input
                                placeholder="Masukkan nama"
                                value={data.nama_pelanggan}
                                onChange={(e) =>
                                    handleChange(
                                        "nama_pelanggan",
                                        e.target.value
                                    )
                                }
                            />
                            {errors.nama_pelanggan && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nama_pelanggan}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Nomor Telepon</Label>
                            <Input
                                placeholder="08xxxxxxxxx"
                                value={data.nomor_telepon_pelanggan}
                                onChange={(e) =>
                                    handleChange(
                                        "nomor_telepon_pelanggan",
                                        e.target.value
                                    )
                                }
                            />
                            {errors.nomor_telepon_pelanggan && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nomor_telepon_pelanggan}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Layanan</Label>
                            <div className="border rounded-md p-3 bg-white">
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                    {layanans.map((l) => (
                                        <label
                                            key={l.id}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.id_layanan.includes(
                                                        l.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleChange(
                                                                "id_layanan",
                                                                [
                                                                    ...data.id_layanan,
                                                                    l.id,
                                                                ]
                                                            );
                                                        } else {
                                                            handleChange(
                                                                "id_layanan",
                                                                data.id_layanan.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        l.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <span>{l.nama_layanan}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Rp{" "}
                                                {Number(
                                                    l.harga_layanan
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {errors.id_layanan && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.id_layanan}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Capster</Label>
                            <Select
                                value={data.id_user}
                                onValueChange={(v) =>
                                    handleChange("id_user", v)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih capster" />
                                </SelectTrigger>
                                <SelectContent>
                                    {capsters.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.id_user && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.id_user}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Tanggal Reservasi</Label>
                            <Input
                                type="date"
                                value={data.tanggal_reservasi}
                                onChange={(e) =>
                                    handleChange(
                                        "tanggal_reservasi",
                                        e.target.value
                                    )
                                }
                            />
                            {errors.tanggal_reservasi && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tanggal_reservasi}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Jam Reservasi</Label>
                            <Input
                                type="time"
                                value={data.jam_reservasi}
                                onChange={(e) =>
                                    handleChange(
                                        "jam_reservasi",
                                        e.target.value
                                    )
                                }
                            />
                            {errors.jam_reservasi && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.jam_reservasi}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-4"
                    >
                        {processing ? "Menyimpan..." : "Buat Reservasi"}
                    </Button>
                </form>
            </section>
        </div>
    );
}
