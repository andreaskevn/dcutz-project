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
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/Components/ui/dialog";
import ImportUserModal from "./import-csv";
import { Plus, Upload } from "lucide-react";

export type Pelanggan = {
  id: string;
  nama_pelanggan: string;
  nomor_telepon_pelanggan: string;
}

interface Props {
  pelanggans: Pelanggan[];
}

export default function IndexPage({ pelanggans }: Props) {
  const { props } = usePage();
  const flash = props.flash as { success?: string; error?: string };
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  // console.log("User Role:", userRole);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);


  const handleDelete = (id: string) => {
    router.delete(route("pelanggan.destroy", id), {
      preserveScroll: true,
      onStart: () => {
        toast.loading("Deleting customer...");
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success("Customer deleted successfully!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("An error occurred while deleting the customer.");
      },
    });
  };


  const columns: ColumnDef<Pelanggan>[] = [
    // { accessorKey: "id", header: "ID" },
    { accessorKey: "nama_pelanggan", header: "Nama Pelanggan" },
    { accessorKey: "nomor_telepon_pelanggan", header: "Nomor Telepon" },
    {
      header: "Action",
      cell: ({ row }) => {
        const pelangganItem = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.visit(route("pelanggan.edit", { id: pelangganItem.id }))}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Pelanggan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus pelanggan ini? Tindakan ini tidak bisa dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(pelangganItem.id)} className="bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] text-black">
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
      <Head title="Manajemen Pelanggan" />
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
          <h1 className="text-2xl font-semibold">Daftar Pelanggan</h1>
          <div className="flex items-center gap-3">
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <ImportUserModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
              />
            </Dialog>

            <Button
              className="px-4 py-2 rounded-md bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] text-black"
              onClick={() => (window.location.href = route("pelanggan.create"))}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pelanggan
            </Button>
          </div>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={pelanggans} />
        </div>
      </div>
    </Layout >
  );
}
