import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MejaItem {
  meja_id: number;
  no_meja: number;
  kapasitas: number;
  status: "kosong" | "dipesan" | "terisi";
}
const Features02Page = () => {
  const [mejas, setMeja] = useState<MejaItem[]>([]);
  const [no_meja, setNomeja] = useState("");
  const [meja_id, setIDMeja] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [editMeja, setEditMeja] = useState<MejaItem | null>(null);

  const openEdit = (meja: MejaItem) => {
    setEditMeja(meja);
    setIDMeja(meja.meja_id.toString());
    setNomeja(meja.no_meja.toString());
    setKapasitas(meja.kapasitas.toString());
  };
  const getData = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      fetch("http://127.0.0.1:8000/api/meja/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data: MejaItem[])   => setMeja(data))
        .catch((error) => console.log("error ", error));
    } catch (error) {
      console.log("error ", error);
      toast.error("Error " + error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://127.0.0.1:8000/api/meja/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Gagal Menghapus Meja");
        throw new Error("Delete Failed");
      }
      toast.success("Berhasil Menambahkan Meja");
      getData();
    } catch (err: any) {
      console.log(err.message);
      toast.error("Gagal Menghapus Meja");
    }
  };
  function handleRemove(id: number) {
    const shouldRemove = confirm("are you sure you want to delete?");

    if (shouldRemove) {
      handleDelete(id);
    }
  }
  const handleUpdate = async () => {
    const token = localStorage.getItem("adminToken");
    const newForm = new FormData();

    newForm.append("no_meja", no_meja);
    newForm.append("kapasitas", kapasitas);
    newForm.append("status", status);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/meja/${editMeja?.meja_id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: newForm,
        }
      );
      if (!response.ok) {
        toast.error("Gagal Mengedit Meja ");
        throw new Error("Gagal Mengedit Meja ");
      }
      await response.json();
      await getData();
      toast.success("Berhasil Mengedit Meja");
      setIDMeja("");
      setNomeja("");
      setKapasitas("");
      setEditMeja(null);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("adminToken");
    const newForm = new FormData();

    newForm.append("no_meja", no_meja);
    newForm.append("kapasitas", kapasitas);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/meja/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newForm,
      });
      if (!response.ok) {
        toast.error("Gagal Menambahkan Meja");
        throw new Error("Gagal Menambahkan meja");
      }
      const data = await response.json();
      toast.success("Berhasil Menambahkan Meja");
      setMeja((prev) => [...prev, data]);
      setNomeja("");
      setKapasitas("");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Gagal Menambahkan Meja");
    }
  };
  return (
    <div className="min-h-screen flex justify-center py-12">
      <div className="w-full">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-14 text-center">
          Daftar Meja
        </h2>
        <div className="ml-[315px]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-[140px]  font-normal bg-gray-100"
              >
                <PlusIcon className="mr-2" /> Tambah Meja
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Meja Baru</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="no_meja" className="text-right">
                    No Meja
                  </Label>
                  <Input
                    id="no_meja"
                    value={no_meja}
                    onChange={(e) => setNomeja(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kapasitas" className="text-right">
                    Kapasitas
                  </Label>
                  <Input
                    id="kapasitas"
                    value={kapasitas}
                    onChange={(e) => setKapasitas(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {editMeja && (
            <Dialog open={!!editMeja} onOpenChange={() => setEditMeja(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Meja</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label>No Meja</Label>
                  <Input
                    value={no_meja}
                    onChange={(e) => setNomeja(e.target.value)}
                  />
                  <Label>Kapasitas</Label>
                  <Input
                    value={kapasitas}
                    onChange={(e) => setKapasitas(e.target.value)}
                    type="number"
                  />
                  <Label>Status</Label>
                  <Select onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup >
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="kosong">Kosong</SelectItem>
                        <SelectItem value="terisi">Terisi</SelectItem>
                        <SelectItem value="dipesan">Di Pesan</SelectItem>
            
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdate}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-md sm:max-w-screen-md lg:max-w-screen-lg w-full mx-auto px-6">
          {mejas.map((meja) => (
            <div key={meja.meja_id} className="flex flex-col text-start">
              <div className="mb-5 sm:mb-6 w-full mx-auto aspect-[3/3] bg-muted rounded-xl" />
              <span className="text-2xl font-semibold tracking-tight">
                Nomer Meja : {meja.no_meja}
              </span>
              <p className="mt-2 max-w-[25ch] text-muted-foreground text-[17px]">
                Kapasitas : {meja.kapasitas}
              </p>
              <p className="mt-2 max-w-[25ch] text-muted-foreground text-[17px]">
                Status : {meja.status}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger className="mx-[25px] my-[10px] bg-gray-100 p-1.5 rounded-sm">
                  Actions
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Action</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      openEdit(meja);
                    }}
                  >
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      handleRemove(meja.meja_id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features02Page;
