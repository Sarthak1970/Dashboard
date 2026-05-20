"use client";

import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Download, Upload, Trash2, Settings2, X, Filter } from "lucide-react";
import { TableData } from "@/utils/dummydata";
import Papa from "papaparse";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  setData: React.Dispatch<React.SetStateAction<TableData[]>>;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  setData
}: DataTableToolbarProps<TData>) {
  const [inputValue, setInputValue] = useState(globalFilter);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(inputValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [inputValue, setGlobalFilter]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  
  const handleDeleteSelected = () => {
    const idsToDelete = selectedRows.map(row => (row.original as any).id);
    setData((prev) => prev.filter(item => !idsToDelete.includes(item.id)));
    table.resetRowSelection();
  };

  const handleExportCSV = () => {
    const rowsToExport = selectedRows.length > 0 
      ? selectedRows.map(row => row.original)
      : table.getFilteredRowModel().rows.map(row => row.original);
    
    const csvData = rowsToExport.map((row: any) => ({
      ...row,
      file: row.file ? row.file.name : "None",
      created_at: new Date(row.created_at).toISOString().split('T')[0]
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = () => {
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const newRecords = results.data as any[];
        const formattedRecords: TableData[] = newRecords.map(record => ({
          id: record.id || `STU-${Math.floor(Math.random() * 10000)}`,
          name: record.name || "Unknown",
          email: record.email || "N/A",
          course: record.course || "N/A",
          status: (record.status === "Active" || record.status === "Inactive") ? record.status : "Inactive",
          created_at: record.created_at ? new Date(record.created_at).getTime() : Date.now(),
          date: record.date || new Date().toISOString().split("T")[0],
          file: null,
          priority: (record.priority === "High" || record.priority === "Medium" || record.priority === "Low") ? record.priority : "Low",
          progress: parseInt(record.progress) || 0
        }));

        setData(prev => [...formattedRecords, ...prev]);
        setIsUploadOpen(false);
        setFile(null);
      }
    });
  };

  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter;

  const renderFilterDropdown = (columnId: string, title: string, options: string[]) => {
    const column = table.getColumn(columnId);
    if (!column) return null;

    const currentFilterValue = (column.getFilterValue() as string[]) || [];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Filter className="mr-2 h-4 w-4" />
            {title}
            {currentFilterValue.length > 0 && (
              <span className="ml-2 rounded-sm bg-secondary px-1 text-xs">{currentFilterValue.length}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map(option => {
            const isSelected = currentFilterValue.includes(option);
            return (
              <DropdownMenuCheckboxItem
                key={option}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  let newValue = [...currentFilterValue];
                  if (checked) newValue.push(option);
                  else newValue = newValue.filter(val => val !== option);
                  
                  column.setFilterValue(newValue.length ? newValue : undefined);
                }}
              >
                {option}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
      <div className="flex flex-1 flex-wrap items-center space-x-2 gap-y-2">
        <Input
          placeholder="Search all columns..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {renderFilterDropdown("status", "Status", ["Active", "Inactive"])}
        {renderFilterDropdown("priority", "Priority", ["High", "Medium", "Low"])}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setInputValue("");
              setGlobalFilter("");
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2 flex-wrap gap-y-2 ml-auto">
        {selectedRows.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-8"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedRows.length})
          </Button>
        )}
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Data from CSV</DialogTitle>
            </DialogHeader>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
              <label htmlFor="csv-upload" className="text-sm font-medium leading-none">
                CSV File
              </label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20">
                <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer max-w-[250px]" />
                <p className="text-xs text-muted-foreground mt-4">Drag & drop or click to select</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={processFile} disabled={!file}>Import Data</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" className="h-8" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
