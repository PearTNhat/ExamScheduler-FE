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
import { adminPaths } from "./path";

// Tên biến được đổi từ 'navigation' thành 'navItems' theo mẫu
const navItems = [
  {
    icon: <BarChart3 size={20} className="text-blue-500" />,
    name: "Tổng quan",
    path: adminPaths.DASHBOARD, // 'href' đổi thành 'path'
  },
  {
    icon: <Calendar size={20} className="text-green-500" />,
    name: "Đợt thi",
    path: adminPaths.EXAM_SESSIONS,
  },
  {
    icon: <BookOpen size={20} className="text-purple-500" />,
    name: "Môn học",
    path: adminPaths.COURSES,
  },
  {
    icon: <MapPin size={20} className="text-red-500" />,
    name: "Phòng thi",
    path: adminPaths.ROOMS,
  },
  {
    icon: <Users size={20} className="text-indigo-500" />,
    name: "Sinh viên",
    path: adminPaths.STUDENTS,
  },
  {
    icon: <Users size={20} className="text-teal-500" />,
    name: "Giảng viên",
    path: adminPaths.TEACHERS,
  },
  {
    icon: <Upload size={20} className="text-orange-500" />,
    name: "Import đăng ký",
    path: adminPaths.IMPORT_REGISTRATIONS,
  },
  {
    icon: <BookOpen size={20} className="text-pink-500" />,
    name: "ĐK học phần",
    path: adminPaths.STUDENT_COURSE_REGISTRATIONS,
  },
  {
    icon: <Settings size={20} className="text-gray-500" />,
    name: "Nhóm thi",
    path: adminPaths.EXAM_GROUPS,
  },
  {
    icon: <Clock size={20} className="text-amber-500" />,
    name: "Xếp lịch tự động",
    path: adminPaths.AUTO_SCHEDULE,
  },
  {
    icon: <Calendar size={20} className="text-emerald-500" />,
    name: "Xem lịch thi",
    path: adminPaths.VIEW_SCHEDULE,
  },
];

// Thêm dòng export ở cuối theo mẫu
export { navItems };
