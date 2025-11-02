"use client";

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Check } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area"

interface Layanan {
    id: string;
    nama_layanan: string;
    harga_layanan: number;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    selectedIds?: string[];
    setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    selectedIds = [],
    setSelectedIds,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    const pageRowIds = table.getRowModel().rows.map(row => row.original.id);
    const allRowIds = React.useMemo(() => data.map(item => item.id), [data]);

    const toggleRow = (id: string) => {
        setSelectedIds?.((prev) => {
            const newValue = prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id];

            console.log("Nilai 'selectedIds' yang baru:", newValue);
            return newValue;
        });

    };

    const toggleSelectAll = () => {
        console.log("Tombol select all (SEMUA DATA) diklik");

        setSelectedIds?.((prev) => {
            const allSelected = allRowIds.length > 0 && allRowIds.every(id => prev.includes(id));

            console.log("Nilai 'selectedIds' setelah toggleSelectAll:", allSelected ? [] : allRowIds);
            if (allSelected) {
                return [];
            } else {
                return allRowIds;
            }
        });

    };

    return (
        <div>
            <div className="w-full overflow-x-auto rounded-md border border-solid">
                <ScrollArea className="w-full rounded-md border border-solid h-[400px]">
                    <Table className="overflow-hidden">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">
                                        <Checkbox
                                            checked={pageRowIds.every(id => selectedIds.includes(id)) && pageRowIds.length > 0}
                                            onCheckedChange={() => toggleSelectAll()}
                                        />
                                    </TableHead>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={selectedIds.includes(row.original.id) ? "selected" : ""}
                                        className="transition-colors"
                                    >
                                        <TableCell className="px-6 py-3 text-sm text-center">
                                            <Checkbox
                                                checked={selectedIds.includes(row.original.id)}
                                                onCheckedChange={() => toggleRow(row.original.id)}
                                            />

                                        </TableCell>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6 py-3 text-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" /> 
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
