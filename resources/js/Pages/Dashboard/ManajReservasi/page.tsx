import { Button } from "@/Components/ui/button";
import { DataTable } from "./data-tables";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { router } from "@inertiajs/react";
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
import { convertDate } from "@/lib/convertDate";
import { Dialog, DialogTrigger } from "@/Components/ui/dialog";
import ImportPresensiModal from "./import-csv";
import { Plus, Upload } from "lucide-react";

export type Reservasi = {
  id: string;
  nama_pelanggan: string;
  nomor_telepon_pelanggan: string;
  status_reservasi: string;
  layanans: string[];
  tanggal_reservasi: string;
  jam_reservasi: string;
  users: string;
  created_at: string;
};

interface Layanan {
  id: string;
  nama_layanan: string;
}


interface Props {
  reservasis: Reservasi[];
  layanans: Layanan[];
}


export default function IndexPage({ reservasis, layanans }: Props) {
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  console.log("reservasis", reservasis);

  const handleDelete = (id: string) => {
    router.delete(route("reservasi.destroy", id), {
      preserveScroll: true,
      onSuccess: () => {
        setAlertMessage({ type: "success", message: "Presensi berhasil dihapus." });
        setTimeout(() => setAlertMessage(null), 3000);
      },
      onError: () => {
        setAlertMessage({ type: "error", message: "Terjadi kesalahan saat menghapus presensi." });
        setTimeout(() => setAlertMessage(null), 3000);
      },
    });
  };

  const columns: ColumnDef<Reservasi>[] = [
    // { accessorKey: "id", header: "ID" },
    { accessorKey: "nama_pelanggan", header: "Nama Pelanggan" },
    { accessorKey: "nomor_telepon_pelanggan", header: "Nomor Telepon Pelanggan" },
    { accessorKey: "status_reservasi", header: "Status Reservasi" },
    {
      accessorKey: "layanans",
      header: "Layanan",
      cell: ({ row }) => {
        const layanans = row.original.layanans;
        if (!layanans || layanans.length === 0) return "-";

        return (
          <ul className="list-disc list-inside space-y-1">
            {layanans.map((layanan: string, index: number) => (
              <li key={index}>{layanan}</li>
            ))}
          </ul>
        );
      },
    },
    { accessorKey: "tanggal_reservasi", header: "Tanggal Reservasi" },
    { accessorKey: "jam_reservasi", header: "Jam Reservasi" },
    {
      accessorKey: "created_at", header: "Created At",
      cell: ({ row }) => {
        const dateString = row.getValue("created_at") as string;
        return convertDate(dateString, "Hari, dd Bulan yyyy HH:mm");
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const presensiItem = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.visit(route("reservasi.edit", { id: presensiItem.id }))}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Reservasi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus reservasii ini? Tindakan ini tidak bisa dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(presensiItem.id)}>
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
      <Head title="Manajemen Reservasi" />
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
          <h1 className="text-2xl font-semibold">Daftar Reservasi</h1>

          <div className="flex items-center gap-3">
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>

              <ImportPresensiModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
              />
            </Dialog>
            
            <Link href={route("reservasi.create")}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Reservasi
              </Button>
            </Link>

          </div>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={reservasis} />
        </div>
      </div>
    </Layout>
  );
}
