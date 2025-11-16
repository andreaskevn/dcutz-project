import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Toaster, toast } from "sonner";

interface Role {
    id: string;
    role_name: string;
}

interface Shift {
    id: string;
    shift_name: string;
}

interface Props {
    roles: Role[];
    shifts: Shift[];
}

export default function CreateKaryawan({ roles, shifts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        id_role: "",
        id_shift: "",
    });

    const resetForm = () => {
        setData({
            name: "",
            email: "",
            password: "",
            id_role: "",
            id_shift: "",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.id_role || !data.id_shift) {
            toast.warning("User's name, role, and shift are required.");
            return;
        }
        const toastId = toast.loading("Adding users...");

        post(route("users.store"), {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Successfully adding users");
                resetForm();
            },
            onError: (errors) => {
                toast.dismiss(toastId);
                toast.error("Failed adding users..");
                console.error(errors);
            },
        });
    };

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
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                {errors.name && <p className="text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && <p className="text-sm">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && <p className="text-sm">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_role">Role</Label>
                                <Select
                                    onValueChange={(value) => setData("id_role", value)}
                                    defaultValue={data.id_role}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.role_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_role && <p className="text-sm">{errors.id_role}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_shift">Shift</Label>
                                <Select
                                    onValueChange={(value) => setData("id_shift", value)}
                                    defaultValue={data.id_shift}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih shift kerja" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((shift) => (
                                            <SelectItem key={shift.id} value={shift.id}>
                                                {shift.shift_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_shift && <p className="text-sm">{errors.id_shift}</p>}
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
