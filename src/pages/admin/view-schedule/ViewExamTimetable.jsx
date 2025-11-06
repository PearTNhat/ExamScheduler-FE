import { useState, useEffect } from "react";
import {
  Calendar,
  Users2,
  Eye,
  Download,
  Filter,
  List,
  CalendarDays,
  Grid3x3,
  Grid3x3Icon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { apiViewTimetableExams, apiGetExams } from "~/apis/examsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import ExamDetailModal from "./components/ExamDetailModal";
import ExamEditModal from "./components/ExamEditModal";
import TimetableGrid from "./components/TimetableGrid";
import CalendarMonthView from "./components/CalendarMonthView";

const ViewExamTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [allExams, setAllExams] = useState([]); // For calendar view
  const [loading, setLoading] = useState(true);
  const [totalExams, setTotalExams] = useState(0);
  const { accessToken } = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("calendar-month"); // "list", "calendar", "timetable", "calendar-month"

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchSessions();
      fetchTimetable();
      fetchAllExams();
    }
  }, [accessToken]);

  const fetchSessions = async () => {
    try {
      const response = await apiGetExamSessions({
        accessToken,
        params: { page: 1, limit: 100 },
      });
      if (response.code === 200) {
        setSessions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const params = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      if (selectedSession && selectedSession !== "all") {
        params.examSessionId = selectedSession;
      }

      const response = await apiViewTimetableExams({ accessToken, params });
      if (response.code === 200) {
        setTimetable(response.data.timetable || []);
        setTotalExams(response.data.totalExams || 0);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải lịch thi");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExams = async () => {
    try {
      const params = { page: 1, limit: 1000 };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedSession && selectedSession !== "all") {
        params.examSessionId = selectedSession;
      }

      const response = await apiGetExams({ accessToken, params });
      if (response.code === 200) {
        setAllExams(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleFilter = () => {
    fetchTimetable();
    fetchAllExams();
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedSession("all");
    fetchTimetable();
    fetchAllExams();
  };

  const handleViewExamDetail = (examId) => {
    setSelectedExamId(examId);
    setIsDetailModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleCalendarEventClick = (exam) => {
    handleViewExamDetail(exam.id);
  };

  const handleExamUpdated = () => {
    // Refresh data after edit
    fetchTimetable();
    fetchAllExams();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Draft: { color: "bg-gray-100 text-gray-700", label: "Nháp" },
      Published: { color: "bg-green-100 text-green-700", label: "Đã công bố" },
      Completed: { color: "bg-blue-100 text-blue-700", label: "Đã hoàn thành" },
      Cancelled: { color: "bg-red-100 text-red-700", label: "Đã hủy" },
    };
    const config = statusMap[status] || statusMap.Draft;
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch Thi Chi Tiết
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Xem lịch thi theo thời gian biểu với đầy đủ thông tin
            </p>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "calendar-month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar-month")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Lịch tháng
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Danh sách
            </Button>
            <Button
              variant={viewMode === "timetable" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timetable")}
              className="gap-2"
            >
              <Grid3x3Icon className="h-4 w-4" />
              Thời khóa biểu
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đợt thi
            </label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn đợt thi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleFilter} className="flex-1">
              Áp dụng
            </Button>
            <Button onClick={handleResetFilter} variant="outline">
              Đặt lại
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số kỳ thi</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalExams}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Số ngày thi</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {timetable.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng sinh viên</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {timetable.reduce(
                  (sum, day) =>
                    sum +
                    day.morning.reduce(
                      (s, exam) => s + (exam.studentCount || 0),
                      0
                    ) +
                    day.afternoon.reduce(
                      (s, exam) => s + (exam.studentCount || 0),
                      0
                    ),
                  0
                )}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Timetable - List or Calendar View */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải lịch thi...</p>
          </div>
        ) : viewMode === "calendar-month" ? (
          <CalendarMonthView
            exams={allExams}
            startDate={startDate}
            onViewDetail={handleViewExamDetail}
            onEdit={handleEditExam}
          />
        ) : viewMode === "timetable" ? (
          <TimetableGrid
            exams={allExams}
            startDate={startDate}
            onViewDetail={handleViewExamDetail}
            onEdit={handleEditExam}
          />
        ) : timetable.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Không có lịch thi nào trong khoảng thời gian này
            </p>
          </div>
        ) : (
          timetable.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{day.day}</h2>
                    <p className="text-blue-100 text-sm mt-1">{day.date}</p>
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {day.morning.length + day.afternoon.length} kỳ thi
                  </Badge>
                </div>
              </div>

              {/* Morning Session */}
              {day.morning.length > 0 && (
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    Buổi sáng ({day.morning.length} kỳ thi)
                  </h3>
                  <div className="space-y-3">
                    {day.morning.map((exam, examIndex) => (
                      <ExamCard
                        key={examIndex}
                        exam={exam}
                        onViewDetail={handleViewExamDetail}
                        onEdit={handleEditExam}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon Session */}
              {day.afternoon.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Buổi chiều ({day.afternoon.length} kỳ thi)
                  </h3>
                  <div className="space-y-3">
                    {day.afternoon.map((exam, examIndex) => (
                      <ExamCard
                        key={examIndex}
                        exam={exam}
                        onViewDetail={handleViewExamDetail}
                        onEdit={handleEditExam}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ExamDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        examId={selectedExamId}
        accessToken={accessToken}
      />

      <ExamEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        exam={selectedExam}
        accessToken={accessToken}
        onExamUpdated={handleExamUpdated}
      />
    </div>
  );
};

// Timetable View Component - Hiển thị dạng thời khóa biểu giống ExamCard
const TimetableView = ({ timetable, onViewDetail, onEdit }) => {
  if (timetable.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">
          Không có lịch thi nào trong khoảng thời gian này
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timetable.map((day, dayIndex) => {
        const allExamsInDay = [...day.morning, ...day.afternoon];

        return (
          <div
            key={dayIndex}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{day.day}</h2>
                  <p className="text-blue-100 text-xs mt-0.5">{day.date}</p>
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs">
                  {allExamsInDay.length} kỳ thi
                </Badge>
              </div>
            </div>

            {/* Exam Cards Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {allExamsInDay.map((exam, examIndex) => (
                <TimetableExamCard
                  key={examIndex}
                  exam={exam}
                  onViewDetail={onViewDetail}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Timetable Exam Card - Giống ExamCard format
const TimetableExamCard = ({ exam, onViewDetail, onEdit }) => {
  const getColorClass = (code) => {
    const colors = [
      {
        border: "border-blue-300",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      },
      {
        border: "border-purple-300",
        bg: "bg-purple-50",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      },
      {
        border: "border-green-300",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      },
      {
        border: "border-orange-300",
        bg: "bg-orange-50",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      },
      {
        border: "border-pink-300",
        bg: "bg-pink-50",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      },
    ];
    const hash = code
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getColorClass(exam.courseCode || exam.examId);

  return (
    <div
      className={`rounded-lg border ${colorClass.border} ${colorClass.bg} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-3">
        {/* Header: Course name & Student count */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Calendar
                className={`h-3.5 w-3.5 ${colorClass.text} flex-shrink-0`}
              />
              <p
                className={`font-bold text-sm ${colorClass.text} truncate`}
                title={exam.courseName}
              >
                {exam.courseName}
              </p>
            </div>
            <p
              className="text-xs text-gray-600 truncate"
              title={exam.courseCode}
            >
              Mã: {exam.courseCode}
            </p>
          </div>
          <Badge className={`${colorClass.badge} text-xs flex-shrink-0`}>
            <Users2 className="h-3 w-3 mr-1" />
            {exam.studentCount}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{exam.time}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{exam.roomName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* <UserCheck className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" /> */}
            <span className="text-gray-600 truncate" title={exam.proctorName}>
              {exam.proctorName}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(exam.examId)}
            className="flex-1 h-7 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Chi tiết
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(exam)}
            className="flex-1 h-7 text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

// Exam Card Component
const ExamCard = ({ exam, onViewDetail, onEdit, getStatusBadge }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">
                {exam.courseName}
              </h4>
              <p className="text-sm text-gray-600">Mã: {exam.courseCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{exam.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users2 className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">
                {exam.studentCount} sinh viên
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Phòng:</span>
              <span className="text-gray-900 font-medium">{exam.roomName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Giám thị:</span>
              <span className="text-gray-900 font-medium">
                {exam.proctorName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(exam.examId)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(exam)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewExamTimetable;
