import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  User,
  Lock,
  Calendar,
  BookOpen,
  FileText,
  Bell,
  Trophy,
  History,
  Home,
} from "lucide-react";
import { cn } from "~/lib/utils";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Về trang chủ",
      href: "/",
      icon: Home,
      description: "Quay về trang chủ",
    },
    {
      title: "Thông tin cá nhân",
      href: "/user",
      icon: User,
      description: "Quản lý thông tin tài khoản",
    },
    {
      title: "Đổi mật khẩu",
      href: "/user/change-password",
      icon: Lock,
      description: "Cập nhật mật khẩu bảo mật",
    },
    {
      title: "Lịch thi",
      href: "/user/exam-schedule",
      icon: Calendar,
      description: "Xem lịch thi sắp tới",
    },
    {
      title: "Môn học đăng ký",
      href: "/user/registered-courses",
      icon: BookOpen,
      description: "Danh sách môn đã đăng ký",
    },
    {
      title: "Kết quả thi",
      href: "/user/exam-results",
      icon: Trophy,
      description: "Xem điểm và kết quả thi",
    },
    {
      title: "Thông báo",
      href: "/user/notifications",
      icon: Bell,
      description: "Thông báo từ hệ thống",
    },
    {
      title: "Lịch sử",
      href: "/user/activity-history",
      icon: History,
      description: "Lịch sử hoạt động",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Tài khoản</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin cá nhân
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
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
                    <div className="flex items-center justify-between">
                      <span>{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-indigo-100 text-indigo-600"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 rounded-full p-2">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Hỗ trợ
                  </h3>
                  <p className="text-xs text-gray-600">Cần trợ giúp?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
