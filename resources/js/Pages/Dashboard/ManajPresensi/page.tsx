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

export type Presensi = {
  id: string;
  waktu_presensi: string;
  created_by: string;
  created_at: string;
};

interface Props {
  presensis: Presensi[];
}

export default function IndexPage({ presensis }: Props) {
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    router.delete(route("presensi.destroy", id), {
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

  const columns: ColumnDef<Presensi>[] = [
    { accessorKey: "waktu_presensi", header: "Waktu Presensi" },
    { accessorKey: "created_by", header: "Created By" },
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
              onClick={() => router.visit(route("presensi.edit", { id: presensiItem.id }))}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Presensi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus presensi ini? Tindakan ini tidak bisa dibatalkan.
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
      <Head title="Manajemen Presensi" />
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
          <h1 className="text-2xl font-semibold">Daftar Presensi</h1>

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

            <Link href={route("presensi.create")}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Presensi
              </Button>
            </Link>

          </div>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={presensis} />
        </div>
      </div>
    </Layout>
  );
}
