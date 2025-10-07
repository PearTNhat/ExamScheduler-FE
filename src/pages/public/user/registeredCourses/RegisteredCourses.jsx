import React from "react";
import { BookOpen, Clock, User, AlertCircle, CheckCircle } from "lucide-react";

function RegisteredCourses() {
  // Mock data - Replace with actual API data
  const registeredCourses = [
    {
      id: 1,
      name: "Lập trình Web",
      code: "IT4409",
      credits: 3,
      instructor: "TS. Nguyễn Văn A",
      semester: "2024-2025 I",
      status: "active",
      schedule: "Thứ 2, 4 (7:30-9:15)",
      room: "TC-101",
    },
    {
      id: 2,
      name: "Cơ sở dữ liệu",
      code: "IT3090",
      credits: 4,
      instructor: "PGS.TS. Trần Thị B",
      semester: "2024-2025 I",
      status: "active",
      schedule: "Thứ 3, 6 (9:25-11:10)",
      room: "TC-205",
    },
    {
      id: 3,
      name: "Mạng máy tính",
      code: "IT4060",
      credits: 3,
      instructor: "TS. Lê Văn C",
      semester: "2024-2025 I",
      status: "completed",
      schedule: "Thứ 5, 7 (13:30-15:15)",
      room: "TC-301",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dropped":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang học";
      case "completed":
        return "Hoàn thành";
      case "dropped":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalCredits = registeredCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const activeCourses = registeredCourses.filter(
    (course) => course.status === "active"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Môn học đăng ký</h1>
          </div>
          <p className="text-indigo-100">
            Danh sách các môn học bạn đã đăng ký
          </p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-800">
              Tính năng đang phát triển
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Trang môn học đăng ký sẽ sớm được hoàn thiện với đầy đủ tính năng.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng môn học</p>
              <p className="text-2xl font-bold text-gray-900">
                {registeredCourses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang học</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng tín chỉ</p>
              <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Danh sách môn học
        </h2>

        <div className="space-y-4">
          {registeredCourses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Mã môn: {course.code} • {course.credits} tín chỉ
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    course.status
                  )}`}
                >
                  {getStatusIcon(course.status)}
                  {getStatusText(course.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{course.schedule}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-600">
                    <span className="font-medium">Học kỳ:</span>{" "}
                    {course.semester}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Phòng học:</span>{" "}
                    {course.room}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegisteredCourses;
