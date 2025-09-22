import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ViewSchedule = () => {
  const [selectedSession, setSelectedSession] = useState("1");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [filterCampus, setFilterCampus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const sessions = [
    { id: "1", name: "Cuối kỳ 2024-1", status: "Đang tiến hành" },
    { id: "2", name: "Giữa kỳ 2024-1", status: "Hoàn thành" },
  ];

  // Mock data
  const examSchedule = [
    {
      id: 1,
      examGroupCode: "CS101-CK2024-01",
      courseCode: "CS101",
      courseName: "Lập trình hướng đối tượng",
      date: "2024-12-15",
      timeSlot: 1, // 1: Sáng, 2: Chiều, 3: Tối
      timeDisplay: "Sáng (7:30-9:30)",
      room: "P101",
      campus: "Cầu Giấy",
      building: "Tòa A",
      studentsCount: 82,
      capacity: 90,
      supervisor: "GS. Nguyễn Văn A",
      status: "Đã xếp",
    },
    {
      id: 2,
      examGroupCode: "CS201-CK2024-01",
      courseCode: "CS201",
      courseName: "Cấu trúc dữ liệu",
      date: "2024-12-15",
      timeSlot: 2,
      timeDisplay: "Chiều (13:30-15:30)",
      room: "P102",
      campus: "Cầu Giấy",
      building: "Tòa A",
      studentsCount: 70,
      capacity: 80,
      supervisor: "TS. Trần Thị B",
      status: "Đã xếp",
    },
    {
      id: 3,
      examGroupCode: "MA101-CK2024-01",
      courseCode: "MA101",
      courseName: "Toán rời rạc",
      date: "2024-12-16",
      timeSlot: 1,
      timeDisplay: "Sáng (7:30-9:30)",
      room: "P201",
      campus: "Hòa Lạc",
      building: "Tòa B",
      studentsCount: 95,
      capacity: 100,
      supervisor: "PGS. Lê Văn C",
      status: "Đã xếp",
    },
    {
      id: 4,
      examGroupCode: "PHY101-CK2024-01",
      courseCode: "PHY101",
      courseName: "Vật lý đại cương",
      date: "2024-12-16",
      timeSlot: 2,
      timeDisplay: "Chiều (13:30-15:30)",
      room: "P103",
      campus: "Cầu Giấy",
      building: "Tòa A",
      studentsCount: 58,
      capacity: 70,
      supervisor: "TS. Phạm Văn D",
      status: "Đã xếp",
    },
  ];

  const campuses = [...new Set(examSchedule.map((exam) => exam.campus))];
  const dates = [...new Set(examSchedule.map((exam) => exam.date))].sort();
  const rooms = [...new Set(examSchedule.map((exam) => exam.room))];

  const filteredExams = examSchedule.filter((exam) => {
    const matchesSearch =
      exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examGroupCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampus = !filterCampus || exam.campus === filterCampus;
    const matchesDate = !filterDate || exam.date === filterDate;
    return matchesSearch && matchesCampus && matchesDate;
  });

  const getTimeSlotColor = (timeSlot) => {
    switch (timeSlot) {
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 text-green-800";
      case 3:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
    const csvContent = [
      [
        "Mã nhóm thi",
        "Mã môn",
        "Tên môn",
        "Ngày",
        "Ca thi",
        "Phòng",
        "Cơ sở",
        "Số SV",
        "Giám thị",
      ].join(","),
      ...filteredExams.map((exam) =>
        [
          exam.examGroupCode,
          exam.courseCode,
          exam.courseName,
          exam.date,
          exam.timeDisplay,
          exam.room,
          exam.campus,
          exam.studentsCount,
          exam.supervisor,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `lich_thi_${selectedSession}.csv`;
    link.click();
  };

  const CalendarView = () => {
    const examsByDate = dates.reduce((acc, date) => {
      acc[date] = filteredExams.filter((exam) => exam.date === date);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
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
                        title={`${exam.courseCode} - ${exam.timeDisplay} - ${exam.room}`}
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

        {dates.map((date) => (
          <div key={date} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date(date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((timeSlot) => {
                const timeSlotNames = { 1: "Sáng", 2: "Chiều", 3: "Tối" };
                const timeSlotExams =
                  examsByDate[date]?.filter(
                    (exam) => exam.timeSlot === timeSlot
                  ) || [];

                return (
                  <div key={timeSlot} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Ca {timeSlotNames[timeSlot]}
                    </h4>

                    {timeSlotExams.length > 0 ? (
                      <div className="space-y-2">
                        {timeSlotExams.map((exam) => (
                          <div key={exam.id} className="bg-gray-50 rounded p-3">
                            <div className="text-sm font-medium text-gray-900">
                              {exam.courseCode} - {exam.courseName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {exam.room} - {exam.campus} ({exam.studentsCount}{" "}
                              SV)
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        Không có lịch thi
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ListView = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Môn học
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredExams.map((exam) => (
            <tr key={exam.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {exam.courseCode} - {exam.courseName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {exam.examGroupCode}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(exam.date).toLocaleDateString("vi-VN")}
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTimeSlotColor(
                    exam.timeSlot
                  )}`}
                >
                  {exam.timeDisplay}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-900">{exam.room}</div>
                    <div className="text-sm text-gray-500">
                      {exam.building} - {exam.campus}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {exam.studentsCount}/{exam.capacity}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          exam.studentsCount > exam.capacity
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (exam.studentsCount / exam.capacity) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exam.supervisor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xem lịch thi</h1>
        <p className="mt-2 text-gray-600">
          Xem và quản lý lịch thi đã được xếp
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        {/* Session Selection */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đợt thi
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cơ sở
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
              >
                <option value="">Tất cả cơ sở</option>
                {campuses.map((campus) => (
                  <option key={campus} value={campus}>
                    {campus}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thi
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="">Tất cả ngày</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("vi-VN")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm môn học..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={exportSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Xuất CSV
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Lịch
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Hiển thị {filteredExams.length} lịch thi
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
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

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredExams.reduce(
                  (sum, exam) => sum + exam.studentsCount,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Sinh viên</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
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

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {dates.length}
              </div>
              <div className="text-sm text-gray-500">Ngày thi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? <ListView /> : <CalendarView />}

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có lịch thi
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy lịch thi phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;
