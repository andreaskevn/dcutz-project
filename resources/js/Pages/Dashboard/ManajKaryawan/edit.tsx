import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface Role {
    id: string;
    role_name: string;
}

interface Shift {
    id: string;
    shift_name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    id_role: string;
    id_shift: string;
}

interface Props {
    user: User;
    roles: Role[];
    shifts: Shift[];
}

export default function EditKaryawan({ user, roles, shifts }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        id_role: user.id_role || "",
        id_shift: user.id_shift || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("users.update", user.id));
    };

    return (
        <Layout>
            <Head title="Edit Karyawan" />
            <div className="py-10 px-6">
                <Card className="shadow-md border border-solid">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Edit Karyawan</CardTitle>
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
                                <Label htmlFor="id_role">Role</Label>
                                <Select
                                    value={data.id_role}
                                    onValueChange={(value) => setData("id_role", value)}
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
                                    value={data.id_shift}
                                    onValueChange={(value) => setData("id_shift", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {shifts.find((shift) => shift.id === data.id_shift)?.shift_name || "Pilih shift kerja"}
                                        </SelectValue>
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
                                <Button type="submit" disabled={processing}>
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
