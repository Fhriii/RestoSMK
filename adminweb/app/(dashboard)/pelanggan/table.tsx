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

export type User = {
  username: string;
  password: string;
  id:number;
  email: string;
  no_hp: string;
  status: string;
  alamat: string;
};

export function UserTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [username, setUSername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [no_hp, setNo] = useState("");
  const [alamat,setAlamat] = useState("");
  const [email,setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok){
        toast.error("Error Tidak bisa mendapatakan data")
        throw new Error("Failed to fetch reservation data");
        
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
      
      
    } catch (err) {
      toast.error("Error Tidak bisa mendapatakan data")
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
    formData.append("username", username);
    formData.append("password", password);
    formData.append("no_hp", no_hp);
    formData.append("status", status);
    formData.append("alamat", alamat);
    formData.append("email", email);
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        toast.error("Gagal Menambahkan User")
        throw new Error("Gagal menambahkan user");
      }
      const data = await response.json();
      setData((prev) => [...prev, data]);
      toast.success("Berhasil Menambahkan User")
      setUSername("");
      setPassword("");
      setStatus("");
      setAlamat("");
      setNo("");
      setEmail("")
      setOpen(false);
    } catch (err) {
      toast.error("Gagal Menambahkan User")
      console.log("Error ", err);
    }
  };

  const columns = getUserColumns(
    (r) => console.log("Update", r),
    async(r) => {
          const token = localStorage.getItem("adminToken")
          try{
            const response = await fetch(
              `http://127.0.0.1:8000/api/user/${r.id}/`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                
              }
            );
            if (!response.ok) {
              throw new Error("Failed");
            }
            toast.success("Berhasil Menghapus User")
            fetchReservations()
          }
          catch{
            toast.error("Gagal Menghapus User")
            
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
        Loading user data...
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
          placeholder="Filter by username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("username")?.setFilterValue(e.target.value)
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
              <PlusIcon className="mr-2" /> Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambahkan User</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUSername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
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
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pelanggan">Pelanggan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alamat" className="text-right">
                Alamat
              </Label>
              <Input
                id="Alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="col-span-3"
                type="text"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                type="text"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="no_hp" className="text-right">
                Nomor Hp
              </Label>
              <Input
                id="no_hp"
                value={no_hp}
                onChange={(e) => setNo(e.target.value)}
                className="col-span-3"
                type="text"
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

