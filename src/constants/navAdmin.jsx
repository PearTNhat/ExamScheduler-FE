import {
  LayoutDashboard,
  CalendarDays,
  MapPinned,
  Building2,
  BookText,
  DoorOpen,
  GraduationCap,
  UserSquare,
  CalendarClock,
  UploadCloud,
  Notebook,
  UsersRound,
  Bot,
  CalendarRange,
  Settings, // có thể vẫn giữ nếu dùng cho config
} from "lucide-react";
import { adminPaths } from "./path";

const navItems = [
  {
    icon: <LayoutDashboard size={20} className="text-blue-500" />,
    name: "Tổng quan",
    path: adminPaths.DASHBOARD,
  },
  {
    icon: <CalendarDays size={20} className="text-green-500" />,
    name: "Đợt thi",
    path: adminPaths.EXAM_SESSIONS,
  },
  {
    icon: <MapPinned size={20} className="text-purple-500" />,
    name: "Địa điểm",
    path: adminPaths.LOCATIONS,
  },
  {
    icon: <Building2 size={20} className="text-rose-500" />,
    name: "Phòng ban",
    path: adminPaths.DEPARTMENTS,
  },
  {
    icon: <BookText size={20} className="text-indigo-500" />,
    name: "Môn học",
    path: adminPaths.COURSES,
  },
  {
    icon: <DoorOpen size={20} className="text-red-500" />,
    name: "Phòng thi",
    path: adminPaths.ROOMS,
  },
  {
    icon: <GraduationCap size={20} className="text-sky-500" />,
    name: "Sinh viên",
    path: adminPaths.STUDENTS,
  },
  {
    icon: <UserSquare size={20} className="text-emerald-500" />,
    name: "Giảng viên",
    path: adminPaths.LECTURES,
  },
  {
    icon: <CalendarClock size={20} className="text-yellow-500" />,
    name: "Xếp lịch",
    path: adminPaths.SCHEDULE,
  },
  {
    icon: <UploadCloud size={20} className="text-orange-500" />,
    name: "Import đăng ký",
    path: adminPaths.IMPORT_REGISTRATIONS,
  },
  {
    icon: <Notebook size={20} className="text-pink-500" />,
    name: "ĐK học phần",
    path: adminPaths.STUDENT_COURSE_REGISTRATIONS,
  },
  {
    icon: <UsersRound size={20} className="text-gray-500" />,
    name: "Nhóm thi",
    path: adminPaths.EXAM_GROUPS,
  },
  {
    icon: <Bot size={20} className="text-amber-500" />,
    name: "Xếp lịch tự động",
    path: adminPaths.AUTO_SCHEDULE,
  },
  {
    icon: <CalendarRange size={20} className="text-emerald-500" />,
    name: "Xem lịch thi",
    path: adminPaths.VIEW_SCHEDULE,
  },
];

export { navItems };
