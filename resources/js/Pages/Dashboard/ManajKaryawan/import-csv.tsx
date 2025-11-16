"use client";

import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { AlertCircle, FileDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { FormEvent } from "react";

interface ImportReservasiModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ImportUserModal({ open, onOpenChange }: ImportReservasiModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("users.import.store"), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const hasRowErrors = Object.keys(errors).length > 0 && !errors.file;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Import User dari CSV</DialogTitle>
                    <DialogDescription>
                        Unggah file CSV untuk membuat data user secara massal.
                    </DialogDescription>
                </DialogHeader>

                {hasRowErrors && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Gagal Memproses File</AlertTitle>
                        <AlertDescription>
                            <p>Terdapat kesalahan pada data di dalam file CSV Anda:</p>
                            <ul className="list-disc list-inside mt-2">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index} className="text-sm">{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="file-import">File CSV</Label>
                        <Input
                            id="file-import"
                            type="file"
                            accept=".csv,.txt"
                            onChange={(e) => setData("file", e.target.files ? e.target.files[0] : null)}
                            className="file:font-semibold"
                            disabled={processing}
                        />
                        {errors.file && <p className="text-sm mt-1">{errors.file}</p>}
                    </div>

                    <div className="text-sm">
                        <a
                            href="/template/template user.csv"
                            download
                            className="inline-flex items-center hover:underline"
                        >
                            <FileDown className="h-4 w-4 mr-1" />
                            Download Template CSV
                        </a>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#00D79E] to-[#0BD0D4] text-black">
                            {processing ? "Mengunggah..." : "Import"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
