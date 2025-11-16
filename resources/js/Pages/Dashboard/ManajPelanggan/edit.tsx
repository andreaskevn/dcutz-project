import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Toaster, toast } from "sonner";

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
    nomor_telepon_pelanggan: string;
}

interface Props {
    pelanggan: Pelanggan;
}


export default function EditPelanggan({ pelanggan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_pelanggan: pelanggan.nama_pelanggan || "",
        nomor_telepon_pelanggan: pelanggan.nomor_telepon_pelanggan || "",
    });

    const resetForm = () => {
        setData({
            nama_pelanggan: "",
            nomor_telepon_pelanggan: "",
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.nama_pelanggan || !data.nomor_telepon_pelanggan) {
            toast.warning("Customer's name and phone number are required.");
            return;
        }
        const toastId = toast.loading("Updating customer...");

        put(route("pelanggan.update", pelanggan.id), {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Successfully updating customers");
                resetForm();
            },
            onError: (errors) => {
                toast.dismiss(toastId);
                toast.error("Failed updating customers");
                console.error(errors);
            },
        });
    };

    return (
        <Layout>
            <Head title="Edit User" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Edit Pelanggan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nama_pelanggan">Nama Pelanggan</Label>
                                <Input
                                    id="nama_pelanggan"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData("nama_pelanggan", e.target.value)}
                                />
                                {errors.nama_pelanggan && <p className="text-sm">{errors.nama_pelanggan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomor_telepon_pelanggan">Nomor Telepon Pelanggan</Label>
                                <Input
                                    id="nomor_telepon_pelanggan"
                                    placeholder="Masukkan nomor telepon"
                                    value={data.nomor_telepon_pelanggan}
                                    onChange={(e) => setData("nomor_telepon_pelanggan", e.target.value)}
                                />
                                {errors.nomor_telepon_pelanggan && <p className="text-sm">{errors.nomor_telepon_pelanggan}</p>}
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
