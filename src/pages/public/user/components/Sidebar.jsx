import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Lock, Calendar, BookOpen, FileText } from "lucide-react";
import { cn } from "~/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Thông tin cá nhân",
      href: "/",
      icon: User,
      description: "Quản lý thông tin tài khoản",
    },
    // {
    //   title: "Đổi mật khẩu",
    //   href: "/change-password",
    //   icon: Lock,
    //   description: "Cập nhật mật khẩu bảo mật",
    // },
    {
      title: "Lịch thi",
      href: "/exam-schedule",
      icon: Calendar,
      description: "Xem lịch thi sắp tới",
    },
    // {
    //   title: "Môn học đăng ký",
    //   href: "/registered-courses",
    //   icon: BookOpen,
    //   description: "Danh sách môn đã đăng ký",
    // },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200  overflow-y-auto">
      <div>
        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-indigo-500"
                  )}
                />
                <div className="flex-1">
                  <span className="text-sm">{item.title}</span>
                  <div
                    className={cn(
                      "text-xs mt-1 transition-colors",
                      isActive ? "text-indigo-100" : "text-gray-500"
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
