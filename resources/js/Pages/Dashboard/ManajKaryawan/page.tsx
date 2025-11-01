import { Button } from "@/Components/ui/button";
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { router } from "@inertiajs/react";
import { DataTable } from "./data-tables";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";

export type Karyawan = {
  name: string
  role: number
  email: string
  shift: string
  id: string
}

interface Props {
  users: Karyawan[];
}

export default function IndexPage({ users }: Props) {
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleDelete = (id: string) => {
    router.delete(route("users.destroy", id), {
      preserveScroll: true,
      onSuccess: () => {
        setAlertMessage({ type: "success", message: "User berhasil dihapus." });
        setTimeout(() => setAlertMessage(null), 3000);
      },
      onError: () => {
        setAlertMessage({ type: "error", message: "Terjadi kesalahan saat menghapus presensi." });
        setTimeout(() => setAlertMessage(null), 3000);
      },
    });
  };

  const columns: ColumnDef<Karyawan>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "shift", header: "Shift" },
    {
      header: "Action",
      cell: ({ row }) => {
        const karyawanItem = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.visit(route("users.edit", { id: karyawanItem.id }))}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Karyawan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus karyawan ini? Tindakan ini tidak bisa dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(karyawanItem.id)}>
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <Head title="Manajemen Karyawan" />
      <div className="px-8 py-10 w-full">
        {alertMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Alert variant={alertMessage.type === "success" ? "destructive" : "destructive"}>
              <AlertTitle>{alertMessage.type === "success" ? "Sukses" : "Gagal"}</AlertTitle>
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Daftar Karyawan</h1>
          <Button
            className="px-4 py-2 rounded-md"
            onClick={() => (window.location.href = route("users.create"))}
          >
            Tambah Karyawan
          </Button>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={users} />
        </div>
      </div>
    </Layout>
  );
}
