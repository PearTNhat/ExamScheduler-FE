import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import StudentCourseRegistrationModal from "./StudentCourseRegistrationModal";

const StudentCourseRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    examSession: "",
    course: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Mock data - thay thế bằng API call thực tế
  const mockRegistrations = [
    {
      id: 1,
      studentId: "SV001",
      studentName: "Nguyễn Văn A",
      courseId: "CS101",
      courseName: "Lập trình cơ bản",
      sessionId: "HK1_2024",
      sessionName: "Học kỳ 1 năm 2024",
      registrationDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      studentId: "SV002",
      studentName: "Trần Thị B",
      courseId: "CS102",
      courseName: "Cấu trúc dữ liệu",
      sessionId: "HK1_2024",
      sessionName: "Học kỳ 1 năm 2024",
      registrationDate: "2024-01-16",
      status: "active",
    },
    {
      id: 3,
      studentId: "SV003",
      studentName: "Lê Văn C",
      courseId: "CS101",
      courseName: "Lập trình cơ bản",
      sessionId: "HK2_2024",
      sessionName: "Học kỳ 2 năm 2024",
      registrationDate: "2024-01-17",
      status: "cancelled",
    },
  ];

  const examSessions = [
    { id: "HK1_2024", name: "Học kỳ 1 năm 2024" },
    { id: "HK2_2024", name: "Học kỳ 2 năm 2024" },
  ];

  const courses = [
    { id: "CS101", name: "Lập trình cơ bản" },
    { id: "CS102", name: "Cấu trúc dữ liệu" },
    { id: "CS103", name: "Thuật toán" },
  ];

  const students = [
    { id: "SV001", name: "Nguyễn Văn A" },
    { id: "SV002", name: "Trần Thị B" },
    { id: "SV003", name: "Lê Văn C" },
    { id: "SV004", name: "Phạm Thị D" },
  ];

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setRegistrations(mockRegistrations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.courseId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.examSession) {
      filtered = filtered.filter(
        (reg) => reg.sessionId === filters.examSession
      );
    }

    if (filters.course) {
      filtered = filtered.filter((reg) => reg.courseId === filters.course);
    }

    if (filters.status) {
      filtered = filtered.filter((reg) => reg.status === filters.status);
    }

    setFilteredRegistrations(filtered);
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrations, searchTerm, filters]);

  const handleAddRegistration = () => {
    setSelectedRegistration(null);
    setShowModal(true);
  };

  const handleEditRegistration = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleDeleteRegistration = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đăng ký này?")) {
      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    }
  };

  const handleSaveRegistration = (registrationData) => {
    if (selectedRegistration) {
      // Update existing registration
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === selectedRegistration.id
            ? { ...reg, ...registrationData }
            : reg
        )
      );
    } else {
      // Add new registration
      const newRegistration = {
        ...registrationData,
        studentName:
          students.find((s) => s.id === registrationData.studentId)?.name || "",
        courseName:
          courses.find((c) => c.id === registrationData.courseId)?.name || "",
        sessionName:
          examSessions.find((s) => s.id === registrationData.sessionId)?.name ||
          "",
      };
      setRegistrations((prev) => [...prev, newRegistration]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Không xác định";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
              Quản lý việc đăng ký học phần của sinh viên cho các đợt thi
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Upload className="w-4 h-4" />
              Import Excel
            </button>
            <button
              onClick={handleAddRegistration}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm đăng ký
            </button>
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
                placeholder="Tìm kiếm theo tên, mã SV, môn học..."
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
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={filters.course}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, course: e.target.value }))
              }
            >
              <option value="">Tất cả môn học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="cancelled">Đã hủy</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-pink-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng đăng ký</p>
              <p className="text-lg font-semibold text-gray-900">
                {registrations.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {registrations.filter((r) => r.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-lg font-semibold text-gray-900">
                {registrations.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-lg font-semibold text-gray-900">
                {registrations.filter((r) => r.status === "cancelled").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đợt thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                      <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không tìm thấy đăng ký nào
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-pink-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {registration.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.courseId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {registration.sessionName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(
                        registration.registrationDate
                      ).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                          registration.status
                        )}`}
                      >
                        {getStatusIcon(registration.status)}
                        {getStatusText(registration.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditRegistration(registration)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteRegistration(registration.id)
                          }
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">
                {filteredRegistrations.length}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">
                {filteredRegistrations.length}
              </span>{" "}
              kết quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Trước
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-pink-50 text-sm font-medium text-pink-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal */}
      <StudentCourseRegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        registration={selectedRegistration}
        onSave={handleSaveRegistration}
        students={students}
        courses={courses}
        examSessions={examSessions}
      />
    </div>
  );
};

export default StudentCourseRegistrations;
