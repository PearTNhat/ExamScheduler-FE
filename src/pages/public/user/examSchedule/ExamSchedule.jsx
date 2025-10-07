import React from "react";
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from "lucide-react";

function ExamSchedule() {
  // Mock data - Replace with actual API data
  const upcomingExams = [
    {
      id: 1,
      subject: "Lập trình Web",
      code: "IT4409",
      date: "2025-01-15",
      time: "08:00 - 10:00",
      room: "TC-101",
      type: "Giữa kỳ",
      status: "scheduled",
    },
    {
      id: 2,
      subject: "Cơ sở dữ liệu",
      code: "IT3090",
      date: "2025-01-18",
      time: "14:00 - 16:00",
      room: "TC-205",
      type: "Cuối kỳ",
      status: "scheduled",
    },
    {
      id: 3,
      subject: "Mạng máy tính",
      code: "IT4060",
      date: "2025-01-22",
      time: "10:00 - 12:00",
      room: "TC-301",
      type: "Cuối kỳ",
      status: "pending",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã xếp lịch";
      case "pending":
        return "Chờ xếp lịch";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Lịch thi</h1>
          </div>
          <p className="text-indigo-100">Xem lịch thi sắp tới của bạn</p>
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
              Trang lịch thi sẽ sớm được hoàn thiện với đầy đủ tính năng.
            </p>
          </div>
        </div>
      </div>

      {/* Exam List Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Lịch thi sắp tới
        </h2>

        <div className="space-y-4">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exam.subject}
                  </h3>
                  <p className="text-sm text-gray-500">Mã môn: {exam.code}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {getStatusText(exam.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(exam.date).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Phòng {exam.room}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">
                  <BookOpen className="h-4 w-4" />
                  Thi {exam.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamSchedule;
