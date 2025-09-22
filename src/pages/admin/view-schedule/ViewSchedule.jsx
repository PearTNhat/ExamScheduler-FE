import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ViewSchedule = () => {
  const [selectedSession, setSelectedSession] = useState("1");
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoom, setFilterRoom] = useState("");

  const sessions = [
    { id: "1", name: "Cuối kỳ 2024-1" },
    { id: "2", name: "Giữa kỳ 2024-1" },
  ];

  const examData = [
    {
      id: 1,
      date: "2024-12-15",
      time: "Sáng (7:30-9:30)",
      courseCode: "CS101",
      courseName: "Lập trình hướng đối tượng",
      room: "P101",
      campus: "Cầu Giấy",
      students: 82,
      capacity: 50,
      supervisor: "GS. Nguyễn Văn A",
    },
    {
      id: 2,
      date: "2024-12-15",
      time: "Chiều (13:30-15:30)",
      courseCode: "CS201",
      courseName: "Cấu trúc dữ liệu",
      room: "P102",
      campus: "Cầu Giấy",
      students: 70,
      capacity: 45,
      supervisor: "TS. Trần Thị B",
    },
    {
      id: 3,
      date: "2024-12-16",
      time: "Sáng (7:30-9:30)",
      courseCode: "MA101",
      courseName: "Toán rời rạc",
      room: "P201",
      campus: "Hòa Lạc",
      students: 95,
      capacity: 60,
      supervisor: "PGS. Lê Văn C",
    },
  ];

  const rooms = [...new Set(examData.map((exam) => exam.room))];

  const filteredExams = examData.filter((exam) => {
    const matchesSearch =
      exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = !filterRoom || exam.room === filterRoom;
    return matchesSearch && matchesRoom;
  });

  const getExamsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredExams.filter((exam) => exam.date === dateStr);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const exportSchedule = () => {
    // Simulate export functionality
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredExams, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "lich_thi.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xem lịch thi</h1>
        <p className="mt-2 text-gray-600">
          Xem và quản lý lịch thi đã được xếp
        </p>
      </div>

      {/* Header Controls */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
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

          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-medium border ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } rounded-l-md`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Lịch
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                viewMode === "list"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } rounded-r-md`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Danh sách
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm môn thi..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
          >
            <option value="">Tất cả phòng</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <button
            onClick={exportSchedule}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Hôm nay
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const dayExams = getExamsForDate(day);
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-1 border border-gray-100 ${
                    isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div
                    className={`text-sm ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } mb-1`}
                  >
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                        title={`${exam.courseCode} - ${exam.time} - ${exam.room}`}
                      >
                        {exam.courseCode}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giám thị
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(exam.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-sm text-gray-500">{exam.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.courseCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{exam.room}</div>
                        <div className="text-sm text-gray-500">
                          {exam.campus}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {exam.students}/{exam.capacity}
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            exam.students > exam.capacity
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (exam.students / exam.capacity) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.supervisor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredExams.length}
              </div>
              <div className="text-sm text-gray-500">Lịch thi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredExams.reduce((sum, exam) => sum + exam.students, 0)}
              </div>
              <div className="text-sm text-gray-500">Sinh viên thi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {rooms.length}
              </div>
              <div className="text-sm text-gray-500">Phòng thi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {[...new Set(filteredExams.map((exam) => exam.date))].length}
              </div>
              <div className="text-sm text-gray-500">Ngày thi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedule;
