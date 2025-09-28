import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Plus,
  Download,
  Upload,
  User,
  BookOpen,
  Calendar,
  Users,
  Settings,
  Clock,
  ChevronRight,
  Filter,
  FileSpreadsheet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { cn } from "../../../lib/utils";

const StudentCourseRegistrations = () => {
  const [openCourses, setOpenCourses] = useState([]);
  // Removed unused state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    examSession: "",
    registered: "all", // all, registered, unregistered
  });
  const [loading, setLoading] = useState(false);
  const [showClassReportModal, setShowClassReportModal] = useState(false);

  // Mock data cho các môn học đã mở đăng ký
  const mockOpenCourses = [
    {
      id: "CS101",
      name: "Lập trình cơ bản",
      code: "CS101",
      sessionId: "HK1_2024",
      sessionName: "Học kỳ 1 năm 2024",
      credits: 3,
      totalStudents: 120,
      registeredStudents: 85,
      deadline: "2024-02-15",
      status: "open",
    },
    {
      id: "CS102",
      name: "Cấu trúc dữ liệu và giải thuật",
      code: "CS102",
      sessionId: "HK1_2024",
      sessionName: "Học kỳ 1 năm 2024",
      credits: 4,
      totalStudents: 100,
      registeredStudents: 67,
      deadline: "2024-02-15",
      status: "open",
    },
    {
      id: "CS103",
      name: "Hệ điều hành",
      code: "CS103",
      sessionId: "HK1_2024",
      sessionName: "Học kỳ 1 năm 2024",
      credits: 3,
      totalStudents: 80,
      registeredStudents: 45,
      deadline: "2024-02-20",
      status: "open",
    },
    {
      id: "CS104",
      name: "Mạng máy tính",
      code: "CS104",
      sessionId: "HK2_2024",
      sessionName: "Học kỳ 2 năm 2024",
      credits: 3,
      totalStudents: 90,
      registeredStudents: 12,
      deadline: "2024-03-01",
      status: "open",
    },
  ];

  // Mock data cho sinh viên
  const mockStudents = [
    {
      id: "SV001",
      name: "Nguyễn Văn A",
      code: "SV001",
      class: "KTPM01",
      email: "nguyenvana@email.com",
      phone: "0123456789",
      registered: true,
    },
    {
      id: "SV002",
      name: "Trần Thị B",
      code: "SV002",
      class: "KTPM01",
      email: "tranthib@email.com",
      phone: "0123456788",
      registered: false,
    },
    {
      id: "SV003",
      name: "Lê Văn C",
      code: "SV003",
      class: "KTPM02",
      email: "levanc@email.com",
      phone: "0123456787",
      registered: true,
    },
    {
      id: "SV004",
      name: "Phạm Thị D",
      code: "SV004",
      class: "KTPM02",
      email: "phamthid@email.com",
      phone: "0123456786",
      registered: false,
    },
    {
      id: "SV005",
      name: "Hoàng Văn E",
      code: "SV005",
      class: "KTPM01",
      email: "hoangvane@email.com",
      phone: "0123456785",
      registered: true,
    },
    {
      id: "SV006",
      name: "Vũ Thị F",
      code: "SV006",
      class: "KTPM03",
      email: "vuthif@email.com",
      phone: "0123456784",
      registered: false,
    },
  ];

  const examSessions = [
    { id: "HK1_2024", name: "Học kỳ 1 năm 2024" },
    { id: "HK2_2024", name: "Học kỳ 2 năm 2024" },
  ];

  useEffect(() => {
    fetchOpenCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm xuất báo cáo Excel cho tất cả các lớp
  const exportAllClassesReport = () => {
    // Nhóm sinh viên theo lớp
    const studentsByClass = mockStudents.reduce((acc, student) => {
      if (!acc[student.class]) {
        acc[student.class] = [];
      }
      acc[student.class].push(student);
      return acc;
    }, {});

    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();

    // Tạo sheet tổng quan
    const overviewData = [
      ["BÁO CÁO TỔNG QUAN ĐĂNG KÝ HỌC PHẦN"],
      ["Ngày xuất báo cáo:", new Date().toLocaleDateString("vi-VN")],
      [""],
      [
        "STT",
        "Lớp",
        "Tổng SV",
        "Đã đăng ký",
        "Chưa đăng ký",
        "Tỷ lệ đăng ký (%)",
      ],
    ];

    let sttOverview = 1;
    Object.keys(studentsByClass).forEach((className) => {
      const students = studentsByClass[className];
      const registeredCount = students.filter((s) => s.registered).length;
      const unregisteredCount = students.length - registeredCount;
      const registrationRate = (
        (registeredCount / students.length) *
        100
      ).toFixed(1);

      overviewData.push([
        sttOverview++,
        className,
        students.length,
        registeredCount,
        unregisteredCount,
        registrationRate,
      ]);
    });

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    // Set column widths
    overviewSheet["!cols"] = [
      { width: 10 },
      { width: 15 },
      { width: 12 },
      { width: 15 },
      { width: 15 },
      { width: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, overviewSheet, "Tổng quan");

    // Tạo sheet cho từng lớp
    Object.keys(studentsByClass).forEach((className) => {
      const students = studentsByClass[className];

      const classData = [
        [`DANH SÁCH ĐĂNG KÝ HỌC PHẦN - LỚP ${className}`],
        [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`],
        [`Tổng số sinh viên: ${students.length}`],
        [`Đã đăng ký: ${students.filter((s) => s.registered).length}`],
        [`Chưa đăng ký: ${students.filter((s) => !s.registered).length}`],
        [""],
        [
          "STT",
          "Mã sinh viên",
          "Họ và tên",
          "Email",
          "Số điện thoại",
          "Trạng thái đăng ký",
          "Ghi chú",
        ],
      ];

      let stt = 1;
      students.forEach((student) => {
        classData.push([
          stt++,
          student.code,
          student.name,
          student.email,
          student.phone,
          student.registered ? "Đã đăng ký" : "Chưa đăng ký",
          student.registered ? "" : "Cần theo dõi",
        ]);
      });

      const classSheet = XLSX.utils.aoa_to_sheet(classData);
      // Set column widths
      classSheet["!cols"] = [
        { width: 8 },
        { width: 15 },
        { width: 25 },
        { width: 30 },
        { width: 15 },
        { width: 18 },
        { width: 15 },
      ];

      // Tô màu header
      const headerRange = XLSX.utils.decode_range(classSheet["!ref"]);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 6, c: C });
        if (!classSheet[headerCell]) continue;
        classSheet[headerCell].s = {
          fill: { fgColor: { rgb: "4F46E5" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
        };
      }

      XLSX.utils.book_append_sheet(workbook, classSheet, className);
    });

    // Xuất file
    const fileName = `Bao_cao_dang_ky_hoc_phan_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Hàm xuất báo cáo cho một lớp cụ thể
  const exportClassReport = (className) => {
    const classStudents = mockStudents.filter(
      (student) => student.class === className
    );

    if (classStudents.length === 0) {
      alert(`Không tìm thấy sinh viên nào trong lớp ${className}`);
      return;
    }

    const workbook = XLSX.utils.book_new();

    const classData = [
      [`DANH SÁCH ĐĂNG KÝ HỌC PHẦN - LỚP ${className}`],
      [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`],
      [`Tổng số sinh viên: ${classStudents.length}`],
      [`Đã đăng ký: ${classStudents.filter((s) => s.registered).length}`],
      [`Chưa đăng ký: ${classStudents.filter((s) => !s.registered).length}`],
      [
        `Tỷ lệ đăng ký: ${(
          (classStudents.filter((s) => s.registered).length /
            classStudents.length) *
          100
        ).toFixed(1)}%`,
      ],
      [""],
      [
        "STT",
        "Mã sinh viên",
        "Họ và tên",
        "Email",
        "Số điện thoại",
        "Trạng thái đăng ký",
        "Môn đã đăng ký",
        "Ghi chú",
      ],
    ];

    let stt = 1;
    classStudents.forEach((student) => {
      const registeredCourses = student.registered
        ? openCourses
            .filter((course) => course.registeredStudents > 0)
            .map((c) => c.name)
            .join(", ")
        : "Chưa có";

      classData.push([
        stt++,
        student.code,
        student.name,
        student.email,
        student.phone,
        student.registered ? "Đã đăng ký" : "Chưa đăng ký",
        registeredCourses,
        student.registered ? "Hoàn thành đăng ký" : "Cần liên hệ để đăng ký",
      ]);
    });

    const sheet = XLSX.utils.aoa_to_sheet(classData);
    sheet["!cols"] = [
      { width: 8 },
      { width: 15 },
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 18 },
      { width: 40 },
      { width: 25 },
    ];

    XLSX.utils.book_append_sheet(workbook, sheet, className);

    const fileName = `Bao_cao_lop_${className}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Hàm xuất báo cáo theo môn học
  const exportCourseReport = (course) => {
    const registeredStudents = mockStudents.filter(
      (student) => student.registered
    );

    const workbook = XLSX.utils.book_new();

    const courseData = [
      [`BÁO CÁO ĐĂNG KÝ MÔN HỌC: ${course.name}`],
      [`Mã môn: ${course.code}`],
      [`Đợt thi: ${course.sessionName}`],
      [`Số tín chỉ: ${course.credits}`],
      [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`],
      [`Hạn đăng ký: ${new Date(course.deadline).toLocaleDateString("vi-VN")}`],
      [`Tổng chỉ tiêu: ${course.totalStudents}`],
      [`Đã đăng ký: ${course.registeredStudents}`],
      [`Còn lại: ${course.totalStudents - course.registeredStudents}`],
      [""],
      [
        "STT",
        "Mã sinh viên",
        "Họ và tên",
        "Lớp",
        "Email",
        "Số điện thoại",
        "Ngày đăng ký",
        "Trạng thái",
      ],
    ];

    let stt = 1;
    registeredStudents.forEach((student) => {
      courseData.push([
        stt++,
        student.code,
        student.name,
        student.class,
        student.email,
        student.phone,
        new Date().toLocaleDateString("vi-VN"),
        "Đã xác nhận",
      ]);
    });

    const sheet = XLSX.utils.aoa_to_sheet(courseData);
    sheet["!cols"] = [
      { width: 8 },
      { width: 15 },
      { width: 25 },
      { width: 12 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, sheet, course.code);

    const fileName = `Bao_cao_mon_${course.code}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const fetchOpenCourses = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setOpenCourses(mockOpenCourses);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching open courses:", error);
      setLoading(false);
    }
  };

  const getRegistrationProgress = (registered, total) => {
    const percentage = (registered / total) * 100;
    return {
      percentage: percentage.toFixed(1),
      color:
        percentage >= 80
          ? "bg-green-500"
          : percentage >= 50
          ? "bg-yellow-500"
          : "bg-red-500",
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Đang mở";
      case "closed":
        return "Đã đóng";
      case "upcoming":
        return "Sắp mở";
      default:
        return "Không xác định";
    }
  };

  // Class Report Modal Component
  const ClassReportModal = ({ isOpen, onClose }) => {
    const classesSummary = Array.from(
      new Set(mockStudents.map((s) => s.class))
    ).map((className) => {
      const students = mockStudents.filter((s) => s.class === className);
      const registeredCount = students.filter((s) => s.registered).length;
      return {
        name: className,
        totalStudents: students.length,
        registeredStudents: registeredCount,
        unregisteredStudents: students.length - registeredCount,
        registrationRate: ((registeredCount / students.length) * 100).toFixed(
          1
        ),
      };
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              Xuất báo cáo theo lớp
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">Chọn lớp để xuất báo cáo chi tiết</p>
              <Button
                onClick={exportAllClassesReport}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Xuất tất cả lớp
              </Button>
            </div>

            <div className="grid gap-4">
              {classesSummary.map((classInfo) => (
                <div
                  key={classInfo.name}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Lớp {classInfo.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Tổng SV:</span>
                          <span className="font-medium ml-1">
                            {classInfo.totalStudents}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Đã đăng ký:</span>
                          <span className="font-medium ml-1 text-green-600">
                            {classInfo.registeredStudents}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Chưa đăng ký:</span>
                          <span className="font-medium ml-1 text-red-600">
                            {classInfo.unregisteredStudents}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tỷ lệ:</span>
                          <span className="font-medium ml-1">
                            {classInfo.registrationRate}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              parseFloat(classInfo.registrationRate) >= 80
                                ? "bg-green-500"
                                : parseFloat(classInfo.registrationRate) >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${classInfo.registrationRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button
                        onClick={() => exportClassReport(classInfo.name)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Xuất báo cáo
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Student Registration Modal Component
  const StudentRegistrationModal = ({ course, onClose }) => {
    const [filteredStudents, setFilteredStudents] = useState(mockStudents);
    const [localSelectedStudents, setLocalSelectedStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState("");
    const [studentFilter, setStudentFilter] = useState("all");

    useEffect(() => {
      let filtered = mockStudents;

      if (studentSearch) {
        filtered = filtered.filter(
          (student) =>
            student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.code.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.class.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearch.toLowerCase())
        );
      }

      if (studentFilter !== "all") {
        filtered = filtered.filter((student) => {
          if (studentFilter === "registered") return student.registered;
          if (studentFilter === "unregistered") return !student.registered;
          return true;
        });
      }

      setFilteredStudents(filtered);
    }, [studentSearch, studentFilter]);

    const handleStudentToggle = (studentId) => {
      setLocalSelectedStudents((prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId)
          : [...prev, studentId]
      );
    };

    const handleSelectAll = (checked) => {
      if (checked) {
        setLocalSelectedStudents(filteredStudents.map((student) => student.id));
      } else {
        setLocalSelectedStudents([]);
      }
    };

    const handleSave = () => {
      // Logic để lưu đăng ký sinh viên
      console.log(
        "Registering students:",
        localSelectedStudents,
        "for course:",
        course.id
      );
      onClose();
    };

    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            Đăng ký sinh viên cho môn: {course.name}
          </DialogTitle>
          <DialogDescription>
            Chọn sinh viên để đăng ký học phần {course.code} -{" "}
            {course.sessionName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Course Info */}
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Mã môn:</span>
                <p className="text-gray-900">{course.code}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tín chỉ:</span>
                <p className="text-gray-900">{course.credits}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Đã đăng ký:</span>
                <p className="text-gray-900">
                  {course.registeredStudents}/{course.totalStudents}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Hạn đăng ký:</span>
                <p className="text-gray-900">
                  {new Date(course.deadline).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã SV, lớp, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
              >
                <option value="all">Tất cả sinh viên</option>
                <option value="registered">Đã đăng ký</option>
                <option value="unregistered">Chưa đăng ký</option>
              </select>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={
                      localSelectedStudents.length ===
                        filteredStudents.length && filteredStudents.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label className="text-sm font-medium">
                    Chọn tất cả ({filteredStudents.length})
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  Đã chọn: {localSelectedStudents.length}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
              <div className="grid gap-2 p-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                      localSelectedStudents.includes(student.id)
                        ? "bg-pink-50 border-pink-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <Checkbox
                      checked={localSelectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.code} - {student.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                          <span
                            className={cn(
                              "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                              student.registered
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {student.registered ? "Đã đăng ký" : "Chưa đăng ký"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={localSelectedStudents.length === 0}
            >
              Đăng ký {localSelectedStudents.length} sinh viên
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-pink-500" />
              Quản lý Đăng ký Học phần
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý việc đăng ký học phần của sinh viên cho các môn học đã mở
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowClassReportModal(true)}
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm môn học..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={filters.examSession}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, examSession: e.target.value }))
              }
            >
              <option value="">Tất cả đợt thi</option>
              {examSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng môn học
            </CardTitle>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 text-pink-500 mr-2" />
              <span className="text-2xl font-bold">{openCourses.length}</span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đang mở đăng ký
            </CardTitle>
            <div className="flex items-center">
              <Settings className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {openCourses.filter((c) => c.status === "open").length}
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng sinh viên đăng ký
            </CardTitle>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {openCourses.reduce(
                  (sum, course) => sum + course.registeredStudents,
                  0
                )}
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tỷ lệ đăng ký
            </CardTitle>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">
                {openCourses.length > 0
                  ? (
                      (openCourses.reduce(
                        (sum, course) => sum + course.registeredStudents,
                        0
                      ) /
                        openCourses.reduce(
                          (sum, course) => sum + course.totalStudents,
                          0
                        )) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Course List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : openCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Không có môn học nào đã mở đăng ký
              </p>
            </CardContent>
          </Card>
        ) : (
          openCourses.map((course) => {
            const progress = getRegistrationProgress(
              course.registeredStudents,
              course.totalStudents
            );
            return (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {course.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.code}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {course.sessionName}
                            </span>
                            <span>{course.credits} tín chỉ</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "px-3 py-1 text-xs font-medium rounded-full border",
                              getStatusBadge(course.status)
                            )}
                          >
                            {getStatusText(course.status)}
                          </span>
                        </div>
                      </div>

                      {/* Progress and Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              Tiến độ đăng ký
                            </span>
                            <span className="text-sm font-medium">
                              {progress.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                progress.color
                              )}
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">
                              {course.registeredStudents}
                            </span>
                            <span className="text-gray-600">
                              /{course.totalStudents} sinh viên
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Hạn:{" "}
                            {new Date(course.deadline).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-6 flex flex-col gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Quản lý đăng ký
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <StudentRegistrationModal
                          course={course}
                          onClose={() => {}}
                        />
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportCourseReport(course)}
                        className="flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Xuất báo cáo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Class Report Modal */}
      <ClassReportModal
        isOpen={showClassReportModal}
        onClose={() => setShowClassReportModal(false)}
      />
    </div>
  );
};

export default StudentCourseRegistrations;
