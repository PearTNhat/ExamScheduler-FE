import React, { useState, useEffect } from "react";
import { X, User, BookOpen, Calendar, Save } from "lucide-react";

const StudentCourseRegistrationModal = ({
  isOpen,
  onClose,
  registration = null,
  onSave,
  students = [],
  courses = [],
  examSessions = [],
}) => {
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    sessionId: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registration) {
      setFormData({
        studentId: registration.studentId || "",
        courseId: registration.courseId || "",
        sessionId: registration.sessionId || "",
        status: registration.status || "active",
      });
    } else {
      setFormData({
        studentId: "",
        courseId: "",
        sessionId: "",
        status: "active",
      });
    }
    setErrors({});
  }, [registration, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = "Vui lòng chọn sinh viên";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Vui lòng chọn môn học";
    }

    if (!formData.sessionId) {
      newErrors.sessionId = "Vui lòng chọn đợt thi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...formData,
        id: registration?.id || Date.now(),
        registrationDate:
          registration?.registrationDate ||
          new Date().toISOString().split("T")[0],
      });
      onClose();
    } catch (error) {
      console.error("Error saving registration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            {registration ? "Chỉnh sửa đăng ký" : "Thêm đăng ký mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Sinh viên
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.studentId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn sinh viên</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.id}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Môn học
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => handleChange("courseId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.courseId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn môn học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.id}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
            )}
          </div>

          {/* Exam Session Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Đợt thi
            </label>
            <select
              value={formData.sessionId}
              onChange={(e) => handleChange("sessionId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.sessionId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn đợt thi</option>
              {examSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
            {errors.sessionId && (
              <p className="mt-1 text-sm text-red-600">{errors.sessionId}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="active">Đang hoạt động</option>
              <option value="cancelled">Đã hủy</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentCourseRegistrationModal;
