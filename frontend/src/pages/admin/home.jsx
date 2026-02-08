import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import { Menu } from "lucide-react";
import AdminSidebar from './adminSiderbar'
export default function AdminPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-100 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 bg-white p-4 shadow">
          <button onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-semibold">Admin Panel</h2>
        </div>

        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

