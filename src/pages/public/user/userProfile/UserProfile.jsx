import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useSelector } from "react-redux";

function UserProfile() {
  const { userData } = useSelector((state) => state.user);

  // Kiểm tra role để hiển thị thông tin phù hợp
  const isStudent = userData?.roles?.includes("SINH_VIEN");
  const isLecturer = userData?.roles?.includes("GIANG_VIEN");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
          <p className="text-indigo-100">Xem thông tin tài khoản của bạn</p>
        </div>

        <div className="p-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {isStudent
                ? userData.studentName?.charAt(0).toUpperCase()
                : isLecturer
                ? userData.lecturerName?.charAt(0).toUpperCase()
                : userData.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isStudent
                  ? userData.studentName
                  : isLecturer
                  ? userData.lecturerName
                  : "Người dùng"}
              </h2>
              <p className="text-gray-500 mt-1">
                {isStudent
                  ? `Mã sinh viên: ${userData.studentCode}`
                  : isLecturer
                  ? `Mã giảng viên: ${userData.lecturerCode}`
                  : userData.email}
              </p>
              <div className="flex gap-2 mt-2">
                {userData.roles?.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold"
                  >
                    {role === "SINH_VIEN"
                      ? "Sinh viên"
                      : role === "GIANG_VIEN"
                      ? "Giảng viên"
                      : role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {userData.email || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </p>
                <p className="text-gray-900 font-semibold mt-1">
                  {userData.phoneNumber || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {formatDate(userData.dateOfBirth)}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="p-3 bg-pink-100 rounded-lg">
                <User className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Giới tính</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {userData.gender === "male"
                    ? "Nam"
                    : userData.gender === "female"
                    ? "Nữ"
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {userData.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Class (for Student) or Department (for Lecturer) */}
            {isStudent && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Lớp học</p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {userData.class || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            )}

            {isLecturer && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Khoa</p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {userData.department || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
