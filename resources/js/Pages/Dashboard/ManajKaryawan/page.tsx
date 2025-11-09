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
import { Upload } from "lucide-react";

export type Karyawan = {
  name: string
  role: number
  email: string
  shift: string
  id: string
}

interface Props {
  users: Karyawan[];
  roles: { id: string; role_name: string }[];
  shifts: { id: string; shift_name: string }[];
  auth: {
    role: string | null;
  };
}

export default function IndexPage({ users, roles, shifts, auth }: Props) {
  const { props } = usePage();
  const flash = props.flash as { success?: string; error?: string };
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const userRole = auth?.role;
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
    router.delete(route("users.destroy", id), {
      preserveScroll: true,
      onStart: () => {
        toast.loading("Deleting user...");
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success("User deleted successfully!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("An error occurred while deleting the user.");
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
            {userRole === "Owner" && (
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
              )}
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <Head title="Manajemen User" />
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
          <h1 className="text-2xl font-semibold">Daftar User</h1>
          {userRole === "Owner" && (
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
                className="px-4 py-2 rounded-md"
                onClick={() => (window.location.href = route("users.create"))}
              >
                Tambah Karyawan
              </Button>
            </div>
          )}
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={users} roles={roles} shifts={shifts} />
        </div>
      </div>
    </Layout >
  );
}
