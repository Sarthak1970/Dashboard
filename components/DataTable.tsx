// components/DataTable.tsx
"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";

import { TableData } from "@/utils/dummydata";
import { columns } from "./ui/columns";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";

import { Card } from "@/components/ui/card";

interface DataTableProps {
  initialData: TableData[];
  setData: React.Dispatch<React.SetStateAction<TableData[]>>;
  isLoading?: boolean;
  error?: string | null;
}

export function DataTable({ initialData, setData, isLoading, error }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: initialData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="shadow-xl border-0 bg-card overflow-hidden">
      <DataTableToolbar 
        table={table} 
        globalFilter={globalFilter} 
        setGlobalFilter={setGlobalFilter} 
        setData={setData}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead className="bg-muted/60 sticky top-0 z-10 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 cursor-pointer select-none ${header.column.getCanSort() ? "hover:text-foreground" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" />
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-destructive font-medium">
                  {error}
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination table={table} />
    </Card>
  );
}