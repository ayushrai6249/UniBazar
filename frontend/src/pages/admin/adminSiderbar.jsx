import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Package, X } from "lucide-react";

const AdminSidebar = ({ open, setOpen }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:static z-40
          h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col p-4
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/admin/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${isActive && "bg-gray-700"
              }`
            }
          >
            <Users className="w-5 h-5" />
            Users
          </NavLink>

          <NavLink
            to="/admin/items"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${isActive && "bg-gray-700"
              }`
            }
          >
            <Package className="w-5 h-5" />
            Items
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
