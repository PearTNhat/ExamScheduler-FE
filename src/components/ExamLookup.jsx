import React, { useState } from "react";
import {
  Search,
  User,
  Download,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const ExamLookup = () => {
  const [studentId, setStudentId] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock data - trong thực tế sẽ fetch từ API
  const mockExamData = {
    SV001: {
      student: {
        id: "SV001",
        name: "Nguyễn Văn An",
        class: "CNTT K65",
        email: "an.nv@student.hust.edu.vn",
      },
      exams: [
        {
          id: 1,
          courseCode: "CS101",
          courseName: "Lập trình hướng đối tượng",
          date: "2024-12-15",
          time: "Sáng (7:30-9:30)",
          room: "P101",
          campus: "Cầu Giấy",
          building: "Tòa A",
          seat: "A15",
          supervisor: "GS. Nguyễn Văn A",
          notes: "Mang theo giấy tờ tùy thân",
          status: "upcoming",
        },
        {
          id: 2,
          courseCode: "CS201",
          courseName: "Cấu trúc dữ liệu và giải thuật",
          date: "2024-12-16",
          time: "Chiều (13:30-15:30)",
          room: "P102",
          campus: "Cầu Giấy",
          building: "Tòa A",
          seat: "B22",
          supervisor: "TS. Trần Thị B",
          notes: "Không được sử dụng tài liệu",
          status: "upcoming",
        },
        {
          id: 3,
          courseCode: "MA101",
          courseName: "Toán rời rạc",
          date: "2024-12-18",
          time: "Sáng (7:30-9:30)",
          room: "P201",
          campus: "Hòa Lạc",
          building: "Tòa B",
          seat: "C08",
          supervisor: "PGS. Lê Văn C",
          notes: "Được sử dụng máy tính cầm tay",
          status: "upcoming",
        },
      ],
    },
    SV002: {
      student: {
        id: "SV002",
        name: "Trần Thị Bình",
        class: "CNTT K65",
        email: "binh.tt@student.hust.edu.vn",
      },
      exams: [
        {
          id: 1,
          courseCode: "CS101",
          courseName: "Lập trình hướng đối tượng",
          date: "2024-12-15",
          time: "Sáng (7:30-9:30)",
          room: "P101",
          campus: "Cầu Giấy",
          building: "Tòa A",
          seat: "A16",
          supervisor: "GS. Nguyễn Văn A",
          notes: "Mang theo giấy tờ tùy thân",
          status: "upcoming",
        },
        {
          id: 2,
          courseCode: "MA101",
          courseName: "Toán rời rạc",
          date: "2024-12-18",
          time: "Sáng (7:30-9:30)",
          room: "P201",
          campus: "Hòa Lạc",
          building: "Tòa B",
          seat: "C09",
          supervisor: "PGS. Lê Văn C",
          notes: "Được sử dụng máy tính cầm tay",
          status: "upcoming",
        },
      ],
    },
  };

  const handleSearch = async () => {
    if (!studentId.trim()) {
      setError("Vui lòng nhập mã sinh viên");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults(null);

    // Simulate API call
    setTimeout(() => {
      const data = mockExamData[studentId.toUpperCase()];
      if (data) {
        setSearchResults(data);
        setError("");
      } else {
        setSearchResults(null);
        setError("Không tìm thấy thông tin sinh viên với mã: " + studentId);
      }
      setLoading(false);
    }, 1500);
  };

  const getTimeUntilExam = (examDate) => {
    const now = new Date();
    const exam = new Date(examDate);
    const timeDiff = exam.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return "Đã thi";
    if (daysDiff === 0) return "Hôm nay";
    if (daysDiff === 1) return "Ngày mai";
    return `Còn ${daysDiff} ngày`;
  };

  const exportSchedule = () => {
    if (!searchResults) return;

    const scheduleText = [
      `LỊCH THI CỦA SINH VIÊN`,
      `===========================`,
      `Họ tên: ${searchResults.student.name}`,
      `Mã SV: ${searchResults.student.id}`,
      `Lớp: ${searchResults.student.class}`,
      `Email: ${searchResults.student.email}`,
      ``,
      `CHI TIẾT LỊCH THI:`,
      `===========================`,
      ...searchResults.exams.map(
        (exam) =>
          `${exam.courseCode} - ${exam.courseName}\n` +
          `Ngày thi: ${new Date(exam.date).toLocaleDateString("vi-VN")}\n` +
          `Thời gian: ${exam.time}\n` +
          `Phòng thi: ${exam.room} - ${exam.building} - ${exam.campus}\n` +
          `Số ghế: ${exam.seat}\n` +
          `Giám thị: ${exam.supervisor}\n` +
          `Ghi chú: ${exam.notes}\n` +
          `----------------------------`
      ),
      ``,
      `LƯU Ý QUAN TRỌNG:`,
      `- Có mặt tại phòng thi trước 30 phút`,
      `- Mang theo thẻ sinh viên và CCCD/CMND`,
      `- Ngồi đúng số ghế được phân công`,
      `- Liên hệ phòng đào tạo: 024.xxx.xxxx`,
    ].join("\n");

    const element = document.createElement("a");
    const file = new Blob([scheduleText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `lich_thi_${searchResults.student.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tra cứu lịch thi
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã sinh viên *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Nhập mã sinh viên (VD: SV001, SV002)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <div className="sm:self-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? "Đang tìm kiếm..." : "Tra cứu"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Student Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Thông tin sinh viên
                </h3>
                <div className="mt-2 space-y-1 text-gray-600">
                  <p>
                    <span className="font-medium">Họ tên:</span>{" "}
                    {searchResults.student.name}
                  </p>
                  <p>
                    <span className="font-medium">Mã SV:</span>{" "}
                    {searchResults.student.id}
                  </p>
                  <p>
                    <span className="font-medium">Lớp:</span>{" "}
                    {searchResults.student.class}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {searchResults.student.email}
                  </p>
                </div>
              </div>
              <button
                onClick={exportSchedule}
                className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Tải lịch thi
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {searchResults.exams.length}
                    </div>
                    <div className="text-sm text-gray-600">Môn thi</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {
                        [
                          ...new Set(
                            searchResults.exams.map((exam) => exam.date)
                          ),
                        ].length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Ngày thi</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        searchResults.exams.filter(
                          (exam) => exam.status === "upcoming"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Sắp thi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Schedule */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Lịch thi chi tiết
            </h3>

            {searchResults.exams.map((exam) => {
              const timeUntil = getTimeUntilExam(exam.date);
              const isToday = timeUntil === "Hôm nay";
              const isTomorrow = timeUntil === "Ngày mai";

              return (
                <div
                  key={exam.id}
                  className={`bg-white rounded-lg shadow-lg p-6 border-l-4 transition-all hover:shadow-xl ${
                    isToday
                      ? "border-red-500 bg-red-50"
                      : isTomorrow
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {exam.courseCode} - {exam.courseName}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {new Date(exam.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{exam.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>
                                {exam.room} - {exam.building}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>Ghế: {exam.seat}</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${
                            isToday
                              ? "bg-red-100 text-red-800"
                              : isTomorrow
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {timeUntil}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Cơ sở:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {exam.campus}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Giám thị:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {exam.supervisor}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="font-medium text-gray-700">
                              Ghi chú:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {exam.notes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isToday && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-red-800 font-medium">
                          Hôm nay là ngày thi! Hãy chuẩn bị đầy đủ giấy tờ và có
                          mặt trước 30 phút.
                        </span>
                      </div>
                    </div>
                  )}

                  {isTomorrow && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                        <span className="text-yellow-800 font-medium">
                          Ngày mai sẽ thi môn này. Hãy chuẩn bị kỹ càng!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample IDs for testing */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Mã sinh viên mẫu để test:
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(mockExamData).map((id) => (
            <button
              key={id}
              onClick={() => setStudentId(id)}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamLookup;
