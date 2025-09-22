import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Download,
  Search,
} from "lucide-react";

const StudentSchedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("1");

  // Mock data - trong thực tế sẽ fetch từ API dựa trên thông tin sinh viên đăng nhập
  const studentInfo = {
    id: "SV001",
    name: "Nguyễn Văn An",
    class: "CNTT K65",
  };

  const sessions = [
    { id: "1", name: "Cuối kỳ 2024-1", status: "Đang tiến hành" },
    { id: "2", name: "Giữa kỳ 2024-1", status: "Hoàn thành" },
  ];

  const examSchedule = [
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
    },
  ];

  const filteredExams = examSchedule.filter(
    (exam) =>
      exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportSchedule = () => {
    const scheduleText = filteredExams
      .map(
        (exam) =>
          `${exam.courseCode} - ${exam.courseName}\nNgày: ${new Date(
            exam.date
          ).toLocaleDateString("vi-VN")}\nThời gian: ${exam.time}\nPhòng: ${
            exam.room
          } - ${exam.campus}\nGhế: ${exam.seat}\n---`
      )
      .join("\n");

    const element = document.createElement("a");
    const file = new Blob([scheduleText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `lich_thi_${studentInfo.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lịch thi của tôi
              </h1>
              <p className="mt-1 text-gray-600">
                {studentInfo.name} - {studentInfo.id} - {studentInfo.class}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
              <button
                onClick={exportSchedule}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Tải về
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm môn thi..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredExams.length}
                </div>
                <div className="text-sm text-gray-500">Môn thi</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {[...new Set(filteredExams.map((exam) => exam.date))].length}
                </div>
                <div className="text-sm text-gray-500">Ngày thi</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    filteredExams.filter(
                      (exam) => new Date(exam.date) > new Date()
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">Sắp thi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Schedule Cards */}
        <div className="space-y-4">
          {filteredExams.map((exam) => {
            const timeUntil = getTimeUntilExam(exam.date);
            const isUpcoming = new Date(exam.date) > new Date();
            const isToday = timeUntil === "Hôm nay";

            return (
              <div
                key={exam.id}
                className={`bg-white shadow rounded-lg p-6 border-l-4 ${
                  isToday
                    ? "border-red-500 bg-red-50"
                    : isUpcoming
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exam.courseCode} - {exam.courseName}
                        </h3>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(exam.date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{exam.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {exam.room} - {exam.building} - {exam.campus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          isToday
                            ? "bg-red-100 text-red-800"
                            : timeUntil === "Ngày mai"
                            ? "bg-yellow-100 text-yellow-800"
                            : isUpcoming
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {timeUntil}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Số ghế:
                        </span>
                        <span className="ml-2 text-gray-900">{exam.seat}</span>
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
                        <span className="ml-2 text-gray-900">{exam.notes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isToday && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-800 font-medium">
                        Hôm nay là ngày thi! Hãy chuẩn bị đầy đủ giấy tờ và có
                        mặt trước 30 phút.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có lịch thi
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bạn chưa có lịch thi nào cho đợt thi này.
            </p>
          </div>
        )}

        {/* Important Notes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            Lưu ý quan trọng
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Có mặt tại phòng thi trước 30 phút so với giờ thi</li>
            <li>• Mang theo thẻ sinh viên và giấy tờ tùy thân có ảnh</li>
            <li>• Không được mang điện thoại, tài liệu trừ khi được phép</li>
            <li>• Ngồi đúng số ghế được phân công</li>
            <li>• Liên hệ phòng đào tạo nếu có thắc mắc: 024.xxx.xxxx</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
