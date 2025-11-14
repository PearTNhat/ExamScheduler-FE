import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data - Replace with actual user data from Redux/Context
  const [user] = useState({
    firstName: "Lê Tuấn ",
    lastName: "Nhật",
    email: "nhat@example.com",
    avatar: "", // URL to avatar image
    role: "admin", // or "user"
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <Header user={user} onToggleSidebar={toggleSidebar} />
          <main className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
