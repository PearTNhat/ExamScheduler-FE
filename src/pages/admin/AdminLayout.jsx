import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSelector(
    (state) => state.sideBar
  );

  useEffect(() => {}, []);
  return (
    <div className="min-h-screen xl:flex">
      <div>
        <SideBar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Header />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
