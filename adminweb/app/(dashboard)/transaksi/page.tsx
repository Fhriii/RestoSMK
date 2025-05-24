"use client";

import React from "react";
import { UserTable } from "./table";

export default function UserPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transaksi List</h1>
      <UserTable />
    </div>
  );
}
