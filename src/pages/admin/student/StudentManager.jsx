import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Filter,
  Eye,
  MoreHorizontal,
  UserCheck,
  UserX,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const StudentManager = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      studentId: "SV001",
      name: "Nguyễn Văn An",
      email: "an.nv@student.ptit.edu.vn",
      phone: "0987654321",
      class: "CNTT K65",
      faculty: "Công nghệ thông tin",
      year: 2023,
      semester: 1,
      status: "active",
      gpa: 3.25,
      totalCredits: 45,
      registeredCourses: 5,
      avatar: null,
    },
    {
      id: 2,
      studentId: "SV002",
      name: "Trần Thị Bình",
      email: "binh.tt@student.ptit.edu.vn",
      phone: "0976543210",
      class: "CNTT K65",
      faculty: "Công nghệ thông tin",
      year: 2023,
      semester: 1,
      status: "active",
      gpa: 3.75,
      totalCredits: 48,
      registeredCourses: 6,
      avatar: null,
    },
    {
      id: 3,
      studentId: "SV003",
      name: "Lê Văn Cường",
      email: "cuong.lv@student.ptit.edu.vn",
      phone: "0965432109",
      class: "KTPM K65",
      faculty: "Công nghệ thông tin",
      year: 2023,
      semester: 1,
      status: "inactive",
      gpa: 2.85,
      totalCredits: 42,
      registeredCourses: 4,
      avatar: null,
    },
    {
      id: 4,
      studentId: "SV004",
      name: "Phạm Thị Dung",
      email: "dung.pt@student.ptit.edu.vn",
      phone: "0954321098",
      class: "KTPM K65",
      faculty: "Công nghệ thông tin",
      year: 2023,
      semester: 1,
      status: "active",
      gpa: 3.9,
      totalCredits: 50,
      registeredCourses: 7,
      avatar: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const faculties = [...new Set(students.map((s) => s.faculty))];
  const classes = [...new Set(students.map((s) => s.class))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = !filterFaculty || student.faculty === filterFaculty;
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesStatus = !filterStatus || student.status === filterStatus;

    return matchesSearch && matchesFaculty && matchesClass && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang học";
      case "inactive":
        return "Tạm nghỉ";
      case "suspended":
        return "Đình chỉ";
      default:
        return "Không xác định";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      setStudents(students.filter((s) => s.id !== studentId));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedStudents.length} sinh viên đã chọn?`
      )
    ) {
      setStudents(students.filter((s) => !selectedStudents.includes(s.id)));
      setSelectedStudents([]);
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Mã SV",
        "Họ tên",
        "Email",
        "Điện thoại",
        "Lớp",
        "Khoa",
        "Năm học",
        "Học kỳ",
        "Trạng thái",
        "GPA",
        "Tín chỉ",
      ].join(","),
      ...filteredStudents.map((student) =>
        [
          student.studentId,
          student.name,
          student.email,
          student.phone,
          student.class,
          student.faculty,
          student.year,
          student.semester,
          getStatusText(student.status),
          student.gpa,
          student.totalCredits,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_sinh_vien.csv";
    link.click();
  };

  const StudentModal = ({ isOpen, onClose, student, isEdit = false }) => {
    const [formData, setFormData] = useState(
      student || {
        studentId: "",
        name: "",
        email: "",
        phone: "",
        class: "",
        faculty: "",
        year: new Date().getFullYear(),
        semester: 1,
        status: "active",
      }
    );

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isEdit) {
        setStudents(
          students.map((s) =>
            s.id === student.id ? { ...formData, id: student.id } : s
          )
        );
      } else {
        setStudents([
          ...students,
          {
            ...formData,
            id: Date.now(),
            gpa: 0,
            totalCredits: 0,
            registeredCourses: 0,
          },
        ]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {isEdit ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã sinh viên *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoa *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.faculty}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty: e.target.value })
                  }
                >
                  <option value="">Chọn khoa</option>
                  <option value="Công nghệ thông tin">
                    Công nghệ thông tin
                  </option>
                  <option value="Điện tử viễn thông">Điện tử viễn thông</option>
                  <option value="Quản trị kinh doanh">
                    Quản trị kinh doanh
                  </option>
                  <option value="Ngoại ngữ">Ngoại ngữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm học
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Đang học</option>
                  <option value="inactive">Tạm nghỉ</option>
                  <option value="suspended">Đình chỉ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sinh viên</h1>
        <p className="mt-2 text-gray-600">
          Quản lý thông tin sinh viên và theo dõi kết quả học tập
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
            >
              <option value="">Tất cả khoa</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">Tất cả lớp</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="inactive">Tạm nghỉ</option>
              <option value="suspended">Đình chỉ</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm sinh viên
            </button>
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Upload className="h-4 w-4" />
              Import
            </button>
          </div>
        </div>

        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                Đã chọn {selectedStudents.length} sinh viên
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {students.length}
              </div>
              <div className="text-sm text-gray-500">Tổng sinh viên</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {students.filter((s) => s.status === "active").length}
              </div>
              <div className="text-sm text-gray-500">Đang học</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {students.filter((s) => s.status === "inactive").length}
              </div>
              <div className="text-sm text-gray-500">Tạm nghỉ</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {students.reduce((sum, s) => sum + s.registeredCourses, 0)}
              </div>
              <div className="text-sm text-gray-500">Đăng ký môn</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedStudents.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin sinh viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Học tập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) =>
                      handleSelectStudent(student.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.studentId} • {student.class}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {student.email}
                    </div>
                    {student.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {student.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>
                      GPA: <span className="font-medium">{student.gpa}</span>
                    </div>
                    <div>Tín chỉ: {student.totalCredits}</div>
                    <div>Môn học: {student.registeredCourses}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      student.status
                    )}`}
                  >
                    {getStatusText(student.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có sinh viên
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy sinh viên phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}

      {/* Modals */}
      <StudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <StudentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        isEdit={true}
      />
    </div>
  );
};

export default StudentManager;
