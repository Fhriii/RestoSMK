"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MenuTerlaris {
  payment_status: string;
  jumlah_transaksi: number;
}

export default function JumlahTransaksi() {
  const [data, setData] = useState<MenuTerlaris[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const token = localStorage.getItem("adminToken");
    fetch("http://localhost:8000/api/total/",{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    }

    ) 
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal mengambil data")
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Jumlah Transaksi</h2>
      {loading ? (
        <p className="text-center">Memuat...</p>
      ) : data.length === 0 ? (
        <p className="text-center">Belum ada data.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="font-medium">{item.payment_status}</span>
              <span className="text-sm text-gray-600">{item.jumlah_transaksi}x</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}