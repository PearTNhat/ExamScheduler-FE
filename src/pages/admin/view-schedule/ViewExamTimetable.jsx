import { useState, useEffect } from "react";
import { Calendar, Users2, Eye, Download, Filter } from "lucide-react";
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
import { apiViewTimetableExams } from "~/apis/examsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import ExamDetailModal from "./components/ExamDetailModal";

const ViewExamTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExams, setTotalExams] = useState(0);
  const { accessToken } = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchSessions();
      fetchTimetable();
    }
  }, [accessToken]);

  const fetchSessions = async () => {
    try {
      const response = await apiGetExamSessions({
        accessToken,
        params: { page: 1, limit: 100 },
      });
      if (response.code === 200) {
        setSessions(response.data.data || []);
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
      if (response) {
        setTimetable(response.timetable || []);
        setTotalExams(response.totalExams || 0);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải lịch thi");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchTimetable();
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedSession("all");
    fetchTimetable();
  };

  const handleViewExamDetail = (examId) => {
    setSelectedExamId(examId);
    setIsDetailModalOpen(true);
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
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

      {/* Timetable */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải lịch thi...</p>
          </div>
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
    </div>
  );
};

// Exam Card Component
const ExamCard = ({ exam, onViewDetail, getStatusBadge }) => {
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
        </div>
      </div>
    </div>
  );
};

export default ViewExamTimetable;
