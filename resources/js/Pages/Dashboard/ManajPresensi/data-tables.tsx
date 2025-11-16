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
import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DatePicker } from "@/Components/ui/date-picker";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    id?: string;
    users?: { id: string; name: string }[];
    filters?: {
        start_date?: string;
        end_date?: string;
        id_user?: string;
    };
}


export function DataTable<TData, TValue>({
    columns,
    data,
    users = [],
    filters = {},
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [startDate, setStartDate] = React.useState(filters.start_date || "");
    const [endDate, setEndDate] = React.useState(filters.end_date || "");
    const [createdBy, setCreatedBy] = React.useState(filters.id_user || "");
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const handleFilter = () => {
        router.get(route("presensi.index"), {
            start_date: startDate,
            end_date: endDate,
            id_user: createdBy,
        }, { preserveScroll: true });
    };

    const resetFilter = () => {
        setStartDate("");
        setEndDate("");
        setCreatedBy("");
        router.get(route("presensi.index"), {}, { preserveScroll: true });
    };

    return (
        <div>
            <div className="flex flex-wrap items-end gap-3 py-2">
                <div>
                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                    <DatePicker
                        value={startDate ? new Date(startDate) : null}
                        onChange={(date) => setStartDate(date ? date.toISOString().split("T")[0] : "")}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">End Date</label>
                    <DatePicker
                        value={endDate ? new Date(endDate) : null}
                        onChange={(date) => setEndDate(date ? date.toISOString().split("T")[0] : "")}
                    />
                </div>


                <div>
                    <label className="text-sm font-medium">Created By</label>
                    <Select onValueChange={(value) => setCreatedBy(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih User" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>

                <Button onClick={handleFilter} className="bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]">Filter</Button>
                <Button onClick={resetFilter} variant="outline">
                    Reset
                </Button>
            </div>
            <div className="w-full overflow-x-auto rounded-md border border-solid">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
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
                                    data-state={row.getIsSelected() && "selected"}
                                    className="transition-colors"
                                >
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
