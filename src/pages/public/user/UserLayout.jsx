import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";

function UserLayout() {
  const { userData, isLoggedIn, accessToken } = useSelector(
    (state) => state.user
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={userData}
        isLoggedIn={isLoggedIn}
        accessToken={accessToken}
      />
      {/* Only show sidebar and layout if logged in */}
      {isLoggedIn ? (
        <div className="flex max-w-7xl">
          {/* Sidebar - sticky on left */}
          <Sidebar />
          {/* Main content */}
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="w-full">
          <Outlet />
        </main>
      )}
    </div>
  );
}

export default UserLayout;
