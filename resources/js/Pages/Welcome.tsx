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
import { DatePicker } from "@/Components/ui/date-picker";

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

    const handleChange = (key, value) => setData(key, value);
    console.log("datadate", data.tanggal_reservasi);

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
            <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]">
                <div className="max-w-3md mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary text-white">
                        Dcut’z Barbershop
                    </h1>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-4 py-2 text-sm font-medium text-[#00D79E] bg-white rounded-lg transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-4 py-2 text-sm font-medium text-[#00D79E] bg-white rounded-lg transition"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <Toaster position="top-center" richColors />

            <section
                className="relative h-[400px] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1400&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 px-4 bg-black/60 p-6 rounded-md">
                    <h1 className="text-3md md:text-2xl font-bold mb-3">
                        Fresh look, fresh vibe, fresh start!
                    </h1>

                    <p className="text-base md:text-lg max-w-xl mx-auto mb-5 opacity-90">
                        Nikmati pengalaman cukur tanpa antre. Reservasi jadwalmu secara online
                        dan biarkan kami sempurnakan penampilanmu
                    </p>

                    <a
                        href="#reservasi"
                        className="px-6 py-3 font-semibold rounded-lg text-white
                       bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] shadow-lg"
                    >
                        Mulai Reservasi
                    </a>
                </div>
            </section>


            <section className="py-12 px-6 md:px-12 bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]">
                <h2 className="text-2xl font-semibold mb-6 text-center text-white">
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

            <section className="py-12 px-6 md:px-12 bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]">
                <h2 className="text-2xl font-semibold mb-6 text-center text-white">
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
                        <DatePicker
                            value={
                                data.tanggal_reservasi
                                    ? new Date(`${data.tanggal_reservasi}T12:00:00`)
                                    : null
                            }
                            onChange={(date) => {
                                if (!date) {
                                    setData("tanggal_reservasi", "");
                                    return;
                                }
                                date.setHours(12, 0, 0, 0);
                                console.log("date", date)

                                const formattedDate =
                                    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                                setData("tanggal_reservasi", formattedDate);
                            }}
                        />
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
                        className="w-full mt-4 bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]"
                    >
                        {processing ? "Menyimpan..." : "Buat Reservasi"}
                    </Button>
                </form>
            </section>

            <section className="py-10 bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white mb-6">Kontak Kami</h2>

                <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] md:w-[500px] space-y-4">

                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-7 h-7"
                        >
                            <path
                                fill="#E1306C"
                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 186.6c-39.6 
                    0-71.7-32.1-71.7-71.7s32.1-71.7 71.7-71.7 71.7 
                    32.1 71.7 71.7-32.1 71.7-71.7 71.7zm146.4-194.3c0 
                    14.9-12 26.9-26.9 26.9-14.9 
                    0-26.9-12-26.9-26.9s12-26.9 
                    26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.5C384.3 
                    41.9 352.7 33.7 317 32 281.2 30.3 166.8 
                    30.3 131 32 95.3 33.7 63.7 41.9 37.5 68.1 11.3 
                    94.3 3.1 125.9 1.4 161.6-.3 197.4-.3 312.6 1.4 
                    348.4c1.7 35.7 9.9 67.3 36.2 93.5 26.2 26.2 57.8 
                    34.4 93.5 36.2 35.7 1.7 150.1 1.7 185.8 
                    0 35.7-1.7 67.3-9.9 93.5-36.2 26.2-26.2 34.4-57.8 
                    36.2-93.5 1.7-35.7 1.7-150 0-185.7z"
                            />
                        </svg>
                        <p className="text-lg">
                            <span className="font-bold">Instagram:</span> dcutz_hairstudio_yk
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-7 h-7"
                        >
                            <path
                                fill="#000000"
                                d="M448,209.91v92.08c-34.28,0-66.36-10.63-92.84-28.65v135.63c0,56.91-46.1,103.03-103.03,103.03H140.54
                    c-56.91,0-103.03-46.12-103.03-103.03V209.91c0-56.91,46.12-103.03,103.03-103.03h111.59c11.45,0,20.76,9.31,20.76,20.76v216.53
                    c0,22.33-18.11,40.44-40.44,40.44h-55.8c-22.33,0-40.44-18.11-40.44-40.44V153.69h56.2v168.98h40.85V127.64
                    c0-34.53,28.04-62.57,62.57-62.57h23.68C356.96,65.07,448,156.11,448,209.91z"
                            />
                        </svg>
                        <p className="text-lg">
                            <span className="font-bold">Tiktok:</span> @dcutz_
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-7 h-7"
                        >
                            <path
                                fill="#25D366"
                                d="M380.9 97.1C339 55.1 283.2 32 224.5 32 102.1 32 2 131.1 2 
                    253.5c0 44.7 11.7 88.3 34 126.7L0 480l103.3-34c36.8 
                    20.1 78.3 30.8 121.2 30.8h.1c122.3 0 221.4-99.1 221.4-221.5 
                    0-58.7-23-114.5-64-156.5zM224.6 
                    438.6h-.1c-38.2 0-75.7-10.2-108.3-29.5l-7.7-4.6-61.3 
                    20.2 20.4-59.6-5-7.8c-21.1-33-32.2-71.3-32.2-110.5C30.4 
                    146.2 117.1 59.5 224.5 59.5c57.5 
                    0 111.6 22.4 152.3 63.1 40.7 40.8 63.1 94.9 63.1 
                    152.4 0 118.5-96.5 213.6-215.3 213.6zm121.1-146.5c-6.6-3.3-39.1-19.3-45.2-21.5-6.1-2.3-10.6-3.3-15.1 
                    3.3-4.5 6.6-17.3 21.5-21.2 25.9-3.9 4.5-7.7 5-14.3 
                    1.7-39.1-19.5-64.8-34.8-90.5-78.8-6.8-11.7 
                    6.8-10.9 19.5-36.2 2.2-4.5 1.1-8.3-.6-11.6-1.7-3.3-15.1-36.4-20.7-49.7-5.4-13.1-10.9-11.3-15.1-11.5-3.9-.2-8.3-.2-12.8-.2s-11.6 
                    1.7-17.7 8.3c-6.1 6.6-23.3 22.8-23.3 55.6 
                    0 32.8 23.8 64.5 27.1 68.9 3.3 4.5 46.7 71.3 
                    113.2 100 15.8 6.8 28.1 10.9 37.7 14 
                    15.8 5 30.1 4.3 41.4 2.6 12.6-1.9 39.1-16 
                    44.6-31.5 5.6-15.5 5.6-28.8 3.9-31.5-1.7-2.9-6.2-4.6-12.8-7.9z"
                            />
                        </svg>
                        <p className="text-lg">
                            <span className="font-bold">WhatsApp:</span> +62 822-8760-1929
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex gap-3 justify-center bg-white p-6">
                    © 2025 D’Cutz!. Semua Hak Dilindungi.
                </div>
            </section>

        </div>
    );
}
