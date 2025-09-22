import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Lập trình hướng đối tượng",
      credits: 3,
      department: "Khoa học máy tính",
      registeredStudents: 85,
    },
    {
      id: 2,
      code: "CS201",
      name: "Cấu trúc dữ liệu và giải thuật",
      credits: 4,
      department: "Khoa học máy tính",
      registeredStudents: 72,
    },
    {
      id: 3,
      code: "MA101",
      name: "Toán rời rạc",
      credits: 3,
      department: "Toán học",
      registeredStudents: 95,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý môn học</h1>
        <p className="mt-2 text-gray-600">Tạo và quản lý danh sách môn học</p>
      </div>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm môn học
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.code}
                  </h3>
                  <p className="text-sm text-gray-500">{course.department}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-900">{course.name}</h4>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{course.credits} tín chỉ</span>
                <span>{course.registeredStudents} sinh viên</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => setShowModal(false)}
          onSave={(courseData) => {
            if (editingCourse) {
              setCourses(
                courses.map((c) =>
                  c.id === editingCourse.id ? { ...c, ...courseData } : c
                )
              );
            } else {
              setCourses([
                ...courses,
                { id: Date.now(), ...courseData, registeredStudents: 0 },
              ]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const CourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: course?.code || "",
    name: course?.name || "",
    credits: course?.credits || 1,
    department: course?.department || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {course ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã môn học
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên môn học
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
              Số tín chỉ
            </label>
            <input
              type="number"
              min="1"
              max="6"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.credits}
              onChange={(e) =>
                setFormData({ ...formData, credits: parseInt(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoa/Viện
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {course ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
