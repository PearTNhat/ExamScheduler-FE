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
  Award,
  Clock,
  GraduationCap,
} from "lucide-react";

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      teacherId: "GV001",
      name: "GS. Nguyễn Văn An",
      email: "an.nv@ptit.edu.vn",
      phone: "0987654321",
      department: "Công nghệ thông tin",
      position: "Giáo sư",
      degree: "Tiến sĩ",
      specialization: "Trí tuệ nhân tạo, Machine Learning",
      experience: 15,
      status: "active",
      totalCourses: 8,
      currentCourses: 3,
      totalStudents: 150,
      avatar: null,
      joinDate: "2010-09-01",
      office: "A101",
      campus: "Cầu Giấy",
    },
    {
      id: 2,
      teacherId: "GV002",
      name: "TS. Trần Thị Bình",
      email: "binh.tt@ptit.edu.vn",
      phone: "0976543210",
      department: "Công nghệ thông tin",
      position: "Tiến sĩ",
      degree: "Tiến sĩ",
      specialization: "Cơ sở dữ liệu, Hệ thống thông tin",
      experience: 8,
      status: "active",
      totalCourses: 6,
      currentCourses: 2,
      totalStudents: 120,
      avatar: null,
      joinDate: "2016-02-15",
      office: "A102",
      campus: "Cầu Giấy",
    },
    {
      id: 3,
      teacherId: "GV003",
      name: "PGS. Lê Văn Cường",
      email: "cuong.lv@ptit.edu.vn",
      phone: "0965432109",
      department: "Điện tử viễn thông",
      position: "Phó giáo sư",
      degree: "Tiến sĩ",
      specialization: "Xử lý tín hiệu số, Truyền thông",
      experience: 12,
      status: "active",
      totalCourses: 10,
      currentCourses: 4,
      totalStudents: 200,
      avatar: null,
      joinDate: "2012-08-20",
      office: "B201",
      campus: "Hòa Lạc",
    },
    {
      id: 4,
      teacherId: "GV004",
      name: "ThS. Phạm Thị Dung",
      email: "dung.pt@ptit.edu.vn",
      phone: "0954321098",
      department: "Ngoại ngữ",
      position: "Thạc sĩ",
      degree: "Thạc sĩ",
      specialization: "Tiếng Anh chuyên ngành, TOEIC",
      experience: 5,
      status: "active",
      totalCourses: 4,
      currentCourses: 2,
      totalStudents: 80,
      avatar: null,
      joinDate: "2019-09-01",
      office: "C301",
      campus: "Cầu Giấy",
    },
    {
      id: 5,
      teacherId: "GV005",
      name: "TS. Hoàng Văn Em",
      email: "em.hv@ptit.edu.vn",
      phone: "0943210987",
      department: "Quản trị kinh doanh",
      position: "Tiến sĩ",
      degree: "Tiến sĩ",
      specialization: "Marketing, Quản lý dự án",
      experience: 6,
      status: "inactive",
      totalCourses: 5,
      currentCourses: 0,
      totalStudents: 90,
      avatar: null,
      joinDate: "2018-03-01",
      office: "D401",
      campus: "Cầu Giấy",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const departments = [...new Set(teachers.map((t) => t.department))];
  const positions = [...new Set(teachers.map((t) => t.position))];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !filterDepartment || teacher.department === filterDepartment;
    const matchesPosition =
      !filterPosition || teacher.position === filterPosition;
    const matchesStatus = !filterStatus || teacher.status === filterStatus;

    return (
      matchesSearch && matchesDepartment && matchesPosition && matchesStatus
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "sabbatical":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang làm việc";
      case "inactive":
        return "Nghỉ việc";
      case "sabbatical":
        return "Nghỉ phép";
      default:
        return "Không xác định";
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case "Giáo sư":
        return "bg-purple-100 text-purple-800";
      case "Phó giáo sư":
        return "bg-blue-100 text-blue-800";
      case "Tiến sĩ":
        return "bg-green-100 text-green-800";
      case "Thạc sĩ":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTeachers(filteredTeachers.map((t) => t.id));
    } else {
      setSelectedTeachers([]);
    }
  };

  const handleSelectTeacher = (teacherId, checked) => {
    if (checked) {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    } else {
      setSelectedTeachers(selectedTeachers.filter((id) => id !== teacherId));
    }
  };

  const handleDelete = (teacherId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giảng viên này?")) {
      setTeachers(teachers.filter((t) => t.id !== teacherId));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedTeachers.length} giảng viên đã chọn?`
      )
    ) {
      setTeachers(teachers.filter((t) => !selectedTeachers.includes(t.id)));
      setSelectedTeachers([]);
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Mã GV",
        "Họ tên",
        "Email",
        "Điện thoại",
        "Khoa/Bộ môn",
        "Chức vụ",
        "Bằng cấp",
        "Chuyên môn",
        "Kinh nghiệm",
        "Trạng thái",
      ].join(","),
      ...filteredTeachers.map((teacher) =>
        [
          teacher.teacherId,
          teacher.name,
          teacher.email,
          teacher.phone,
          teacher.department,
          teacher.position,
          teacher.degree,
          teacher.specialization,
          teacher.experience + " năm",
          getStatusText(teacher.status),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_giang_vien.csv";
    link.click();
  };

  const TeacherModal = ({ isOpen, onClose, teacher, isEdit = false }) => {
    const [formData, setFormData] = useState(
      teacher || {
        teacherId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        degree: "",
        specialization: "",
        experience: 0,
        status: "active",
        office: "",
        campus: "",
        joinDate: new Date().toISOString().split("T")[0],
      }
    );

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isEdit) {
        setTeachers(
          teachers.map((t) =>
            t.id === teacher.id ? { ...formData, id: teacher.id } : t
          )
        );
      } else {
        setTeachers([
          ...teachers,
          {
            ...formData,
            id: Date.now(),
            totalCourses: 0,
            currentCourses: 0,
            totalStudents: 0,
          },
        ]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {isEdit ? "Chỉnh sửa giảng viên" : "Thêm giảng viên mới"}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảng viên *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.teacherId}
                    onChange={(e) =>
                      setFormData({ ...formData, teacherId: e.target.value })
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
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin học thuật
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoa/Bộ môn *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Chọn khoa/bộ môn</option>
                    <option value="Công nghệ thông tin">
                      Công nghệ thông tin
                    </option>
                    <option value="Điện tử viễn thông">
                      Điện tử viễn thông
                    </option>
                    <option value="Quản trị kinh doanh">
                      Quản trị kinh doanh
                    </option>
                    <option value="Ngoại ngữ">Ngoại ngữ</option>
                    <option value="Toán học">Toán học</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chức vụ *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  >
                    <option value="">Chọn chức vụ</option>
                    <option value="Giáo sư">Giáo sư</option>
                    <option value="Phó giáo sư">Phó giáo sư</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                    <option value="Cử nhân">Cử nhân</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bằng cấp cao nhất
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                  >
                    <option value="">Chọn bằng cấp</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                    <option value="Cử nhân">Cử nhân</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm (năm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chuyên môn, lĩnh vực nghiên cứu..."
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin công việc
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cơ sở làm việc
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.campus}
                    onChange={(e) =>
                      setFormData({ ...formData, campus: e.target.value })
                    }
                  >
                    <option value="">Chọn cơ sở</option>
                    <option value="Cầu Giấy">Cầu Giấy</option>
                    <option value="Hòa Lạc">Hòa Lạc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng làm việc
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.office}
                    onChange={(e) =>
                      setFormData({ ...formData, office: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.joinDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
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
                    <option value="active">Đang làm việc</option>
                    <option value="inactive">Nghỉ việc</option>
                    <option value="sabbatical">Nghỉ phép</option>
                  </select>
                </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý giảng viên</h1>
        <p className="mt-2 text-gray-600">
          Quản lý thông tin giảng viên và phân công giảng dạy
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
                placeholder="Tìm kiếm giảng viên..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">Tất cả khoa</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
            >
              <option value="">Tất cả chức vụ</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="inactive">Nghỉ việc</option>
              <option value="sabbatical">Nghỉ phép</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm giảng viên
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

        {selectedTeachers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                Đã chọn {selectedTeachers.length} giảng viên
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
                {teachers.length}
              </div>
              <div className="text-sm text-gray-500">Tổng giảng viên</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {teachers.filter((t) => t.status === "active").length}
              </div>
              <div className="text-sm text-gray-500">Đang làm việc</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  teachers.filter((t) =>
                    ["Giáo sư", "Phó giáo sư"].includes(t.position)
                  ).length
                }
              </div>
              <div className="text-sm text-gray-500">GS & PGS</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {teachers.reduce((sum, t) => sum + t.currentCourses, 0)}
              </div>
              <div className="text-sm text-gray-500">Môn đang dạy</div>
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
                    selectedTeachers.length === filteredTeachers.length &&
                    filteredTeachers.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin giảng viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Học thuật
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảng dạy
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
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher.id)}
                    onChange={(e) =>
                      handleSelectTeacher(teacher.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.teacherId} • {teacher.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {teacher.email}
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center mb-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {teacher.phone}
                      </div>
                    )}
                    {teacher.office && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        {teacher.office} - {teacher.campus}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(
                        teacher.position
                      )} mb-1`}
                    >
                      {teacher.position}
                    </span>
                    <div>Bằng cấp: {teacher.degree}</div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {teacher.experience} năm kinh nghiệm
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>
                      Hiện tại:{" "}
                      <span className="font-medium">
                        {teacher.currentCourses} môn
                      </span>
                    </div>
                    <div>Tổng: {teacher.totalCourses} môn</div>
                    <div>SV: {teacher.totalStudents}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      teacher.status
                    )}`}
                  >
                    {getStatusText(teacher.status)}
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
                        setSelectedTeacher(teacher);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
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
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có giảng viên
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy giảng viên phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}

      {/* Modals */}
      <TeacherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <TeacherModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        isEdit={true}
      />
    </div>
  );
};

export default TeacherManager;
