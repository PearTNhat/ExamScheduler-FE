import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  BookOpen,
  MapPin,
  Users,
  Upload,
  Settings,
  BarChart3,
  Clock,
} from "lucide-react";
import { adminPaths } from "../../constants/path";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Tổng quan", href: adminPaths.DASHBOARD, icon: BarChart3 },
    { name: "Đợt thi", href: adminPaths.EXAM_SESSIONS, icon: Calendar },
    { name: "Môn học", href: adminPaths.COURSES, icon: BookOpen },
    { name: "Phòng thi", href: adminPaths.ROOMS, icon: MapPin },
    { name: "Sinh viên", href: adminPaths.STUDENTS, icon: Users },
    {
      name: "Import đăng ký",
      href: adminPaths.IMPORT_REGISTRATIONS,
      icon: Upload,
    },
    { name: "Nhóm thi", href: adminPaths.EXAM_GROUPS, icon: Settings },
    { name: "Xếp lịch tự động", href: adminPaths.AUTO_SCHEDULE, icon: Clock },
    { name: "Xem lịch thi", href: adminPaths.VIEW_SCHEDULE, icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-50 lg:hidden`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
          <SidebarContent
            navigation={navigation}
            isActive={isActive}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <SidebarContent navigation={navigation} isActive={isActive} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-0">
        <div className="lg:hidden flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Quản lý lịch thi
          </h1>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, isActive, setSidebarOpen }) => {
  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-xl font-bold text-gray-900">Exam Scheduler</h1>
        {setSidebarOpen && (
          <button
            type="button"
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <Icon
                  className={`${
                    isActive(item.href) ? "text-blue-500" : "text-gray-400"
                  } mr-3 flex-shrink-0 h-5 w-5`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default AdminLayout;
