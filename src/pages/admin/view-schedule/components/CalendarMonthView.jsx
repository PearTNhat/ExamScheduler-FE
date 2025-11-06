import { useState, useMemo, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit,
} from "lucide-react";

const CalendarMonthView = ({
  exams = [],
  startDate, // <-- ĐÃ THÊM
  onViewDetail,
  onEdit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // *** ĐÃ THÊM: Đồng bộ với bộ lọc của component cha ***
  useEffect(() => {
    if (startDate) {
      // Nếu cha có lọc ngày, nhảy đến tháng của ngày đó
      // Phải parse ngày theo múi giờ địa phương
      const dateParts = startDate.split("-").map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      setCurrentMonth(localDate);
    } else {
      // Nếu cha reset bộ lọc, quay về tháng hiện tại
      setCurrentMonth(new Date());
    }
  }, [startDate]); // Chạy lại khi startDate từ cha thay đổi
  // *** KẾT THÚC THAY ĐỔI ***

  // Group exams by date
  const examsByDate = useMemo(() => {
    const grouped = {};
    exams.forEach((exam) => {
      const examDate = exam.examDate || exam.exam_date;
      if (!examDate) return;

      const dateKey = format(new Date(examDate), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(exam);
    });
    return grouped;
  }, [exams]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start from Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const handleDateClick = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayExams = examsByDate[dateKey];
    if (dayExams && dayExams.length > 0) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const getExamsForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return examsByDate[dateKey] || [];
  };

  const selectedDateExams = selectedDate ? getExamsForDate(selectedDate) : [];

  // Group selected date exams by session (morning/afternoon)
  const groupedSelectedExams = useMemo(() => {
    if (!selectedDate) return { morning: [], afternoon: [] };

    const dateExams = getExamsForDate(selectedDate);
    const morning = [];
    const afternoon = [];

    dateExams.forEach((exam) => {
      const slot = exam.examSlot || exam.slot;
      const startTime = slot?.start_time || slot?.startTime || "";

      // Check if morning (before 12:00) or afternoon
      if (startTime) {
        const hour = parseInt(startTime.split(":")[0]);
        if (hour < 12) {
          morning.push(exam);
        } else {
          afternoon.push(exam);
        }
      } else {
        afternoon.push(exam); // Default to afternoon if no time
      }
    });

    return { morning, afternoon };
  }, [selectedDate, examsByDate]);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Lịch Thi Theo Tháng
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {format(currentMonth, "MMMM yyyy", { locale: vi })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handlePrevMonth}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleToday}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Hôm nay
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleNextMonth}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className="text-center font-semibold text-sm text-gray-700 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            const dayExams = getExamsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const hasExams = dayExams.length > 0;

            return (
              <div
                key={idx}
                onClick={() => isCurrentMonth && handleDateClick(day)}
                className={`
                  min-h-[100px] p-2 border rounded-lg transition-all
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                  ${
                    isTodayDate
                      ? "border-2 border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }
                  ${
                    hasExams && isCurrentMonth
                      ? "cursor-pointer hover:shadow-md hover:border-blue-300"
                      : ""
                  }
                  ${!hasExams && isCurrentMonth ? "cursor-default" : ""}
                `}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      isTodayDate ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {hasExams && isCurrentMonth && (
                    <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0">
                      {dayExams.length}
                    </Badge>
                  )}
                </div>

                {/* Exam indicators */}
                {hasExams && isCurrentMonth && (
                  <div className="space-y-1">
                    {dayExams.slice(0, 2).map((exam, examIdx) => {
                      const courseName =
                        exam.exam_group?.course?.name ||
                        exam.courseName ||
                        "N/A";
                      const slot = exam.examSlot || exam.slot;
                      const startTime =
                        slot?.start_time || slot?.startTime || "";

                      return (
                        <div
                          key={examIdx}
                          className="bg-blue-100 rounded px-1.5 py-1 text-[10px] truncate"
                          title={courseName}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-blue-700 truncate">
                              {startTime}
                            </span>
                          </div>
                          <div className="text-gray-700 truncate font-medium mt-0.5">
                            {courseName.length > 15
                              ? courseName.substring(0, 15) + "..."
                              : courseName}
                          </div>
                        </div>
                      );
                    })}
                    {dayExams.length > 2 && (
                      <div className="text-[10px] text-blue-600 font-semibold text-center">
                        +{dayExams.length - 2} lịch thi
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for selected date exams */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
              Lịch thi ngày{" "}
              {selectedDate &&
                format(selectedDate, "dd/MM/yyyy", { locale: vi })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Morning Session */}
            {groupedSelectedExams.morning.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Buổi sáng ({groupedSelectedExams.morning.length} kỳ thi)
                </h3>
                <div className="space-y-3">
                  {groupedSelectedExams.morning.map((exam) => (
                    <ExamCardModal
                      key={exam.id}
                      exam={exam}
                      onViewDetail={onViewDetail}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon Session */}
            {groupedSelectedExams.afternoon.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  Buổi chiều ({groupedSelectedExams.afternoon.length} kỳ thi)
                </h3>
                <div className="space-y-3">
                  {groupedSelectedExams.afternoon.map((exam) => (
                    <ExamCardModal
                      key={exam.id}
                      exam={exam}
                      onViewDetail={onViewDetail}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedSelectedExams.morning.length === 0 &&
              groupedSelectedExams.afternoon.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có lịch thi nào trong ngày này
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Exam Card in Modal
const ExamCardModal = ({ exam, onViewDetail, onEdit }) => {
  const courseName = exam.exam_group?.course?.name || exam.courseName || "N/A";
  const examGroupCode = exam.exam_group?.code || exam.courseCode || "";
  const roomCode = exam.room?.code || exam.roomName || "N/A";
  const locationName = exam.room?.location?.name || exam.location || "";
  const studentCount =
    exam.exam_group?.expected_student_count || exam.studentCount || 0;
  const slot = exam.examSlot || exam.slot;
  const startTime = slot?.start_time || slot?.startTime || "";
  const endTime = slot?.end_time || slot?.endTime || "";
  const slotName = slot?.slot_name || slot?.slotName || "";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-base">
                {courseName}
              </h4>
              <p className="text-sm text-gray-600">Mã: {examGroupCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-gray-700 font-medium">
                  {startTime} - {endTime}
                </div>
                <div className="text-xs text-gray-500">{slotName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{studentCount} sinh viên</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-gray-900 font-medium">{roomCode}</span>
                {locationName && (
                  <span className="text-gray-500 text-xs ml-1">
                    ({locationName})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(exam.id)}
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
            <Edit className="h-4 w-4" />
            Sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarMonthView;
