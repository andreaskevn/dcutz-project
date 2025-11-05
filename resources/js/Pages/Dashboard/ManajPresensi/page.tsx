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
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

export type Presensi = {
  id: string;
  waktu_presensi: string;
  id_user: string;
  created_at: string;
};

interface Props {
  presensis: Presensi[];
  users: { id: string; name: string }[];
  filters: {
    start_date?: string;
    end_date?: string;
    created_by?: string;
  };
  auth: {
    role: string | null;
  };
}

export default function IndexPage({ presensis, users, filters, auth }: Props) {
  const { props } = usePage();
  const flash = props.flash as { success?: string; error?: string };
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const userRole = auth?.role;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
            <Button
              variant="secondary"
              onClick={() =>
                router.visit(route("presensi.show", { id: presensiItem.id }))
              }
            >
              Detail
            </Button>
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
            {userRole === "Owner" && (
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams({
                    start_date: filters.start_date ?? "",
                    end_date: filters.end_date ?? "",
                    created_by: filters.created_by ?? "",
                  }).toString();
                  window.open(route("presensi.export") + "?" + params, "_blank");
                }}
              >
                Export Excel
              </Button>
            )}
            <Link href={route("presensi.create")}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Presensi
              </Button>
            </Link>


          </div>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={presensis} users={users} filters={filters} />

        </div>
      </div>
    </Layout>
  );
}
