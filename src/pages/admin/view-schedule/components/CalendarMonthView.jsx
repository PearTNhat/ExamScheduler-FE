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
  Trash2,
} from "lucide-react";

const CalendarMonthView = ({
  timetable = [],
  startDate,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (startDate) {
      const dateParts = startDate.split("-").map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      setCurrentMonth(localDate);
    } else {
      setCurrentMonth(new Date());
    }
  }, [startDate]);

  // Convert timetable array to map for quick lookup
  const timetableMap = useMemo(() => {
    const map = {};
    timetable.forEach((day) => {
      map[day.date] = day;
    });
    return map;
  }, [timetable]);

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
    const dayData = timetableMap[dateKey];
    if (
      dayData &&
      (dayData.morning.length > 0 || dayData.afternoon.length > 0)
    ) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const getDayData = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return (
      timetableMap[dateKey] || { date: dateKey, morning: [], afternoon: [] }
    );
  };

  // Get selected date data
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return { morning: [], afternoon: [] };
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return (
      timetableMap[dateKey] || { date: dateKey, morning: [], afternoon: [] }
    );
  }, [selectedDate, timetableMap]);

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

      <div className="p-4">
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
            const dayData = getDayData(day);
            const totalExams =
              dayData.morning.length + dayData.afternoon.length;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const hasExams = totalExams > 0;

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
                      {totalExams}
                    </Badge>
                  )}
                </div>
                {hasExams && isCurrentMonth && (
                  <div className="space-y-1">
                    {[...dayData.morning, ...dayData.afternoon]
                      .slice(0, 2)
                      .map((examEvent, examIdx) => {
                        const courseName = examEvent.courseCode || "N/A";
                        const startTime = examEvent.slot?.startTime || "";

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
                    {totalExams > 2 && (
                      <div className="text-[10px] text-blue-600 font-semibold text-center">
                        +{totalExams - 2} lịch thi
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
            {selectedDayData.morning.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Buổi sáng ({selectedDayData.morning.length} kỳ thi)
                </h3>
                <div className="space-y-3">
                  {selectedDayData.morning.map((examEvent) => (
                    <ExamCardModal
                      key={examEvent.examId}
                      exam={examEvent}
                      onViewDetail={onViewDetail}
                      onEdit={onEdit}
                      setIsModalOpen={setIsModalOpen}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon Session */}
            {selectedDayData.afternoon.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  Buổi chiều ({selectedDayData.afternoon.length} kỳ thi)
                </h3>
                <div className="space-y-3">
                  {selectedDayData.afternoon.map((examEvent) => (
                    <ExamCardModal
                      key={examEvent.examId}
                      exam={examEvent}
                      onViewDetail={onViewDetail}
                      onEdit={onEdit}
                      setIsModalOpen={setIsModalOpen}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedDayData.morning.length === 0 &&
              selectedDayData.afternoon.length === 0 && (
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
const ExamCardModal = ({
  exam,
  onViewDetail,
  onEdit,
  onDelete,
  setIsModalOpen,
}) => {
  const courseName = exam.courseCode || "N/A";
  const roomCode = exam.room?.code || exam.roomName || "N/A";
  const locationName = exam.room?.location?.name || exam.location || "";
  const studentCount =
    exam.examGroup?.expectedStudentCount || exam.studentCount || 0;
  const slot = exam.examSlot || exam.slot;
  const startTime = slot?.startTime || "";
  const endTime = slot?.endTime || "";
  const slotName = slot?.slotName || "";
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
            <Edit className="h-4 w-4" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setIsModalOpen(false);
              return onDelete && onDelete(exam.examId);
            }}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarMonthView;
