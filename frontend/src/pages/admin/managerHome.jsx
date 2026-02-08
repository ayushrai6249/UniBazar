import React from "react";
import { Outlet } from "react-router-dom";

export default function ManagerHome() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <Outlet />
        </div>
    );
}
