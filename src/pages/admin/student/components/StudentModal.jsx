// src/components/StudentManager/StudentModal.js
import React, { useState, useEffect } from "react";

const StudentModal = ({ isOpen, onClose, student, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    studentCode: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    phoneNumber: "",
  });

  const isEdit = !!student;

  useEffect(() => {
    if (isEdit && student) {
      setFormData({
        studentCode: student.studentCode || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split("T")[0]
          : "",
        gender: student.gender || "male",
        address: student.address || "",
        phoneNumber: student.phoneNumber || "",
      });
    } else {
      // Reset form for adding new student
      setFormData({
        studentCode: "",
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        phoneNumber: "",
      });
    }
  }, [isOpen, student, isEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
            {/* ... (SVG icon for close) ... */}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sinh viên *
              </label>
              <input
                type="text"
                name="studentCode"
                required
                value={formData.studentCode}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full form-input"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full form-input"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
