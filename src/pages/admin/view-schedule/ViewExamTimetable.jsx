import { useState, useEffect } from "react";
import { Calendar, Users2, Filter, List, Grid3x3Icon } from "lucide-react";
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
import TimetableExamCard from "./components/card/TimeableExamCard";
import ExamCard from "./components/card/ExamCard";

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
  console.log("all", allExams);
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
      } else {
        // setAllExams([]);
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
    console.log("click");
    setSelectedExamId(examId);
    setIsDetailModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleExamUpdated = () => {
    fetchTimetable();
    fetchAllExams();
  };
  console.log(isDetailModalOpen);
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
              variant={viewMode === "timetable" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timetable")}
              className="gap-2"
            >
              <Grid3x3Icon className="h-4 w-4" />
              Lịch thi
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
        ) : (
          <TimetableGrid
            exams={allExams}
            startDate={startDate}
            onViewDetail={handleViewExamDetail}
            onEdit={handleEditExam}
          />
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

export default ViewExamTimetable;
