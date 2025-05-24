"use client";

import React from "react";
import { UserTable } from "./table";
import ChartProduct from "@/components/ui/chartt";
import TopMenuTerlaris from "@/components/report_terlaris";
import JumlahTransaksi from "@/components/report_jumlah_transaksi";

export default function UserPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User List</h1>
      <UserTable />
      <div className="grid grid-cols-4 items-start gap-4">
      <TopMenuTerlaris/>
      <JumlahTransaksi/>
      </div>
    </div>
  );
}
