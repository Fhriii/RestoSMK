"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

interface Menuitem {
  id_menu: number;
  nama_menu: string;
  harga: number;
  foto: string;
  stok: number;
}

const Features05Page = () => {
  const [menus, setMenu] = useState<Menuitem[]>([]);
  const [namaMenu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stok, setStok] = useState(1);
  const [editMenu, setEditMenu] = useState<Menuitem | null>(null);
  const [open, setOpen] = useState(false);
  const openEdit = (Menu: Menuitem) => {
    setEditMenu(Menu);
    setNamaMenu(Menu.nama_menu.toString());
    setHarga(Menu.harga.toString());
    setImageFile(null);
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("nama_menu", namaMenu);
    formData.append("harga", harga);
    formData.append("stok", stok.toString()); // pastikan string

    if (imageFile) {
      formData.append("foto", imageFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/menu/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error("Gagal menambahkan menu"); 
      }
      toast.success("Berhasil menambahkan menu"); 
      getData();
      const data = await response.json();
      setMenu((prev) => [...prev, data]); 
      setNamaMenu("");
      setHarga("");
      setStok(0);
      setImageFile(null);
      setOpen(false);
    } catch (error) {
      toast.error("Gagal menambahkan menu"); 
      console.error("Error:", error);
    }
  };
  function handleRemove(id: number) {
    const shouldRemove = confirm("are you sure you want to delete?");

    if (shouldRemove) {
      handleDelete(id);
    }
  }
  const getData = async () => {
    const token = localStorage.getItem("adminToken");
    fetch("http://127.0.0.1:8000/api/menu/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: Menuitem[]) => setMenu(data))
      .catch((error) => console.log("error", error));
    };
    const handleDelete = async (id: number) => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          const result = await response.json();
          console.log(result);
          toast.error("Gagal Menghapus Menu")
          throw new Error(result.message || "Delete Failed");
        }
        
        toast.success("Berhasil Menghapus Menu")
        getData();
      } catch (err: any) {
        toast.error("Gagal Menghapus Menu")
        console.log(err.message);
    }
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("nama_menu", namaMenu);
    formData.append("harga", harga);
    formData.append("id_kategori", stok.toString()); // pastikan string
    if (imageFile) {
      formData.append("foto", imageFile);
    }
    setErrorMessage("");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/menu/${editMenu?.id_menu}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.success("Gagal Mengedit Menu")
        throw new Error(result.message || "Add  Failed");
      }
      getData();
      toast.success("Berhasil Mengedit Menu")
      setOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="max-w-screen-lg w-full py-10 px-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Daftar Menu
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-[140px] font-normal bg-gray-100"
          >
            <PlusIcon className="mr-2" /> Tambah Menu
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Menu Baru</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">
                Nama
              </Label>
              <Input
                id="nama"
                value={namaMenu}
                onChange={(e) => setNamaMenu(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="harga" className="text-right">
                Harga
              </Label>
              <Input
                id="harga"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Stok" className="text-right">
                Stok
              </Label>
              <Input
                id="stok"
                value={stok}
                onChange={(e) => setStok(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4  items-center gap-4">
              <Label htmlFor="gambar" className="text-right">
                Gambar
              </Label>
              <Input
                id="gambar"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editMenu && (
        <Dialog open={!!editMenu}  onOpenChange={() => setEditMenu(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label>Nama</Label>
              <Input
                value={namaMenu}
                onChange={(e) => setNamaMenu(e.target.value)}
              />
              <Label>Harga</Label>
              <Input
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                type="number"
              />
              <Label>Stok</Label>
              <Input
                value={stok}
                onChange={(e) => setStok(parseInt(e.target.value))}
                type="number"
              />
              <Label>Gambar (opsional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="mt-8 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {menus.map((menu) => (
          <Card
            key={menu.id_menu}
            className="flex flex-col border rounded-xl overflow-hidden shadow-none"
          >
            <CardHeader>
              <h4 className="!mt-3 text-xl font-semibold tracking-tight">
                {menu.nama_menu}
              </h4>
              <p className="mt-1 text-muted-foreground text-[17px]">
                {menu.harga}
              </p>
            </CardHeader>
            <CardContent className="mt-auto px-0 pb-0">
              <div>
                <img
                  src={menu.foto}
                  alt="Error"
                  className="bg-muted h-40 ml-6 rounded-tl-xl"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger className="mx-[25px] my-[10px] bg-gray-100 p-1.5 rounded-sm">
                    Actions
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEdit(menu)}>
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemove(menu.id_menu)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features05Page;
