"use client";

import React, { use, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserColumns } from "./column";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { log } from "console";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { toast } from "sonner";
import { Caveat } from "next/font/google";

export type User = {
  id_transaksi:number;
  kode_booking: string;
  status_transaksi: string;
  id_user: number;
  meja_id: number;

};

export function UserTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [open, setOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [kodebooking, setKodebooking] = useState("");
  const [status, setStatus] = useState("");
  const [idUser, setIdUser] = useState("");
  const [idMeja,setIdMeja] = useState("");

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:8000/api/transaksi/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok){
        toast.error("Gagal Mendapatkan Data")
        throw new Error("Failed to fetch reservation data");
      } 
      const result = await response.json();
      toast.success("Berhasil Mendapatkan Data")
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      setError("Failed to load reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReservations();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("kode_booking", kodebooking);
    formData.append("status_transaksi", status);
    formData.append("id_user", idUser);
    formData.append("meja_id", idMeja);
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transaksi/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        toast.error("Gagal Menambahkan Transaksi")
        throw new Error("Gagal menambahkan Transaksi");
        
      }
      const data = await response.json();
      toast.success("Berhasil Menambahkan Transaksi")
      setOpen(false)
      setData((prev) => [...prev, data]);
      setKodebooking("");
      setStatus("");  
      
    } catch (err) {
      console.log("Error ", err);
      toast.error("Gagal Menambahkan Transaksi")
    }
  };

  const columns = getUserColumns(
    async(r) => {
      const token = localStorage.getItem("adminToken")
      try{
        const response = await fetch(
          `http://127.0.0.1:8000/api/transaksi/${r.id_transaksi}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            
          }
        );
        const result = await response.json();
        if (!response.ok) {
          toast.success("Gagal Mengedit Menu")
          throw new Error(result.message || "Add  Failed");
        }
        fetchReservations()
        toast.success("Berhasil Mengedit Menu")
        setOpen(false);
      }catch{

      }
    },
    async(r) => {
      const token = localStorage.getItem("adminToken")
      try{
        const response = await fetch(
          `http://127.0.0.1:8000/api/transaksi/${r.id_transaksi}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            
          }
        );
        fetchReservations()
        toast.success("Berhasil Menghapus Transaksi")
        if (!response.ok) {
          toast.error("Gagal Menghapus Transaksi")
          throw new Error("Failed");
        
        }
      }
      catch{
        toast.error("Gagal Menghapus Transaksi")
        
      }
    }
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        Loading transaksi data...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 flex justify-center items-center h-48">
        {error}
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by status..."
          value={
            (table.getColumn("status_transaksi")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("status_transaksi")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-[160px] ml-2 font-normal bg-gray-100"
            >
              <PlusIcon className="mr-2" /> Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambahkan Transaksi</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kodebooking" className="text-right">
                Kode Booking
              </Label>
              <Input
                id="kodebooking"
                value={kodebooking}
                onChange={(e) => setKodebooking(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id_user" className="text-right">
                ID User
              </Label>
              <Input
                id="id_user"
                value={idUser}
                onChange={(e) => setIdUser(e.target.value)}
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger
                  id="status"
                  className="col-span-3 border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                > 
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="reserved">reserved</SelectItem>
                  <SelectItem value="checkin">checkin</SelectItem>
                  <SelectItem value="done">done</SelectItem>
                  <SelectItem value="failed">failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meja_id" className="text-right">
                meja id
              </Label>
              <Input
                id="meja_id"
                value={idMeja}
                onChange={(e) => setIdMeja(e.target.value)}
                className="col-span-3"
                type="number"
              />
            </div>
         

            <DialogFooter>
              <Button onClick={handleSubmit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

