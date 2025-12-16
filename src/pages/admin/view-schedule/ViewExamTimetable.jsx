import { useState, useEffect } from "react";
import {
  Calendar,
  Users2,
  Filter,
  List,
  Grid3x3Icon,
  Plus,
  X,
  ShieldAlert,
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
import {
  apiViewTimetableExams,
  apiDeleteExam,
  apiCheckExamConflicts,
} from "~/apis/examsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showToastError, showToastSuccess, confirmAlert } from "~/utils/alert";
import { useSelector } from "react-redux";
import ExamDetailModal from "./components/ExamDetailModal";
import ExamEditModal from "./components/ExamEditModal";
import CreateExamModal from "./components/CreateExamModal";
import TimetableGrid from "./components/TimetableGrid";
import CalendarMonthView from "./components/CalendarMonthView";
import ClassPickerModal from "../components/ClassPickerModal";
import DepartmentPickerModal from "../lectures/components/DepartmentPickerModal";
import CoursePickerModal from "../components/CoursePickerModal";
import ConflictCheckModal from "./components/ConflictCheckModal";
import { getInitialDateRange } from "./utils/helper";

// Tính toán giá trị ban đầu một lần
const { start: initialStartDate, end: initialEndDate } = getInitialDateRange();

// Helper function to format ISO date to YYYY-MM-DD
const formatDateToInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ViewExamTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExams, setTotalExams] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const { accessToken } = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [viewMode, setViewMode] = useState("timetable"); // "timetable", "calendar-month"
  const [selectedClass, setSelectedClass] = useState(null);
  const [isClassPickerOpen, setIsClassPickerOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDepartmentPickerOpen, setIsDepartmentPickerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConflictCheckOpen, setIsConflictCheckOpen] = useState(false);
  const [conflictCheckLoading, setConflictCheckLoading] = useState(false);
  const [conflictCheckResult, setConflictCheckResult] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchTimetable();
      fetchExamSessions();
    }
  }, [accessToken]);

  // Auto-set dates from selected exam session
  useEffect(() => {
    if (selectedSession && selectedSession !== "all" && sessions.length > 0) {
      const session = sessions.find(
        (s) => s.id.toString() === selectedSession.toString()
      );
      if (session) {
        if (session.start_date_exam) {
          setStartDate(formatDateToInput(session.start_date_exam));
        }
        if (session.end_date_exam) {
          setEndDate(formatDateToInput(session.end_date_exam));
        }
      }
    }
  }, [selectedSession, sessions]);

  const fetchExamSessions = async () => {
    try {
      const response = await apiGetExamSessions({ accessToken });
      if (response.code === 200) {
        setSessions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching exam sessions:", error);
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
      if (selectedClass) {
        params.classId = selectedClass.id;
      }
      if (selectedDepartment?.id) {
        params.departmentId = selectedDepartment.id;
      }
      if (selectedCourse?.id) {
        params.courseId = selectedCourse.id;
      }

      const response = await apiViewTimetableExams({ accessToken, params });
      if (response.code === 200) {
        setTimetable(response.data.timetable || []);
        setTotalExams(response.data.totalExams || 0);
        setTotalStudents(response.data.totalStudents || 0);
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
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setSelectedSession("all");
    setSelectedClass(null);
    setSelectedDepartment(null);
    setSelectedCourse(null);
    fetchTimetable();
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setIsClassPickerOpen(false);
  };

  const handleRemoveClass = () => {
    setSelectedClass(null);
  };

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setIsDepartmentPickerOpen(false);
  };

  const handleRemoveDepartment = () => {
    setSelectedDepartment(null);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setIsCoursePickerOpen(false);
  };

  const handleRemoveCourse = () => {
    setSelectedCourse(null);
  };

  const handleViewExamDetail = (examId) => {
    setSelectedExamId(examId);
    setIsDetailModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleExamUpdated = () => {
    fetchTimetable();
  };

  const handleExamCreated = () => {
    fetchTimetable();
  };

  const handleCheckConflicts = async () => {
    if (!selectedSession || selectedSession === "all") {
      showToastError("Vui lòng chọn đợt thi để kiểm tra xung đột");
      return;
    }

    try {
      setConflictCheckLoading(true);
      setIsConflictCheckOpen(true);

      const response = await apiCheckExamConflicts({
        accessToken,
        examSessionId: parseInt(selectedSession),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (response.code === 200) {
        setConflictCheckResult(response.data);
      } else {
        showToastError(response.message || "Lỗi khi kiểm tra xung đột");
        setIsConflictCheckOpen(false);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi kiểm tra xung đột");
      setIsConflictCheckOpen(false);
    } finally {
      setConflictCheckLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    // Đợi modal đóng hoàn toàn trước khi hiển thị confirm
    setTimeout(async () => {
      const result = await confirmAlert({
        title: "Xác nhận xóa lịch thi",
        message:
          "Bạn có chắc chắn muốn xóa lịch thi này? Thao tác này sẽ xóa tất cả thông tin đăng ký sinh viên và giám thị liên quan.",
        confirmText: "Xóa",
      });
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteExam({ accessToken, id: examId });
          if (response.code === 200) {
            showToastSuccess("Xóa lịch thi thành công");
            fetchTimetable();
          } else {
            showToastError(response.message || "Lỗi khi xóa lịch thi");
          }
        } catch (error) {
          showToastError(error.message || "Lỗi khi xóa lịch thi");
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
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
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="h-5 w-5" />
            Tạo lịch thi
          </Button>
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
                <SelectItem value={"all"}>Tất cả</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lớp học
            </label>
            {selectedClass ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="flex-1 justify-between py-2 px-3"
                >
                  <span className="truncate">{selectedClass.name}</span>
                  <X
                    className="h-4 w-4 cursor-pointer hover:text-red-600 ml-2"
                    onClick={handleRemoveClass}
                  />
                </Badge>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsClassPickerOpen(true)}
              >
                <Users2 className="h-4 w-4 mr-2" />
                Chọn lớp học
              </Button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoa
            </label>
            {selectedDepartment ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="flex-1 justify-between py-2 px-3"
                >
                  <span className="truncate">
                    {selectedDepartment.departmentName} (ID:{" "}
                    {selectedDepartment.id})
                  </span>
                  <X
                    className="h-4 w-4 cursor-pointer hover:text-red-600 ml-2"
                    onClick={handleRemoveDepartment}
                  />
                </Badge>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsDepartmentPickerOpen(true)}
              >
                Chọn khoa/viện
              </Button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn học
            </label>
            {selectedCourse ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="flex-1 justify-between py-2 px-3"
                >
                  <span className="truncate">
                    {selectedCourse.nameCourse} (ID: {selectedCourse.id})
                  </span>
                  <X
                    className="h-4 w-4 cursor-pointer hover:text-red-600 ml-2"
                    onClick={handleRemoveCourse}
                  />
                </Badge>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCoursePickerOpen(true)}
              >
                Chọn môn học
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-end gap-2 mt-4">
          <Button onClick={handleFilter} className="flex-1">
            Áp dụng
          </Button>
          <Button
            onClick={handleCheckConflicts}
            variant="outline"
            className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Kiểm tra xung đột
          </Button>
          <Button onClick={handleResetFilter} variant="outline">
            Đặt lại
          </Button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số nhóm thi</p>
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
                {totalStudents}
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
            timetable={timetable}
            startDate={startDate}
            onViewDetail={handleViewExamDetail}
            onEdit={handleEditExam}
            onDelete={handleDeleteExam}
          />
        ) : (
          <TimetableGrid
            timetable={timetable}
            startDate={startDate}
            onViewDetail={handleViewExamDetail}
            onEdit={handleEditExam}
            onDelete={handleDeleteExam}
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

      <CreateExamModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onExamCreated={handleExamCreated}
      />

      <ClassPickerModal
        open={isClassPickerOpen}
        onOpenChange={setIsClassPickerOpen}
        onSelect={handleClassSelect}
      />

      <DepartmentPickerModal
        open={isDepartmentPickerOpen}
        onOpenChange={setIsDepartmentPickerOpen}
        onSelect={handleDepartmentSelect}
      />

      <CoursePickerModal
        open={isCoursePickerOpen}
        onOpenChange={setIsCoursePickerOpen}
        onSelect={handleCourseSelect}
      />

      <ConflictCheckModal
        open={isConflictCheckOpen}
        onOpenChange={setIsConflictCheckOpen}
        conflicts={conflictCheckResult}
        loading={conflictCheckLoading}
      />
    </div>
  );
};

export default ViewExamTimetable;
