import { useState, useMemo, useEffect } from "react";
import { startOfWeek, addDays, format, subDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import ExamCard from "./card/ExamCard";

const TimetableGrid = ({
  timetable = [],
  startDate,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    if (startDate) {
      const dateParts = startDate.split("-").map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      setCurrentWeekStart(startOfWeek(localDate, { weekStartsOn: 1 }));
    } else {
      setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    }
  }, [startDate]);

  // Tạo mảng 6 ngày (T2-T7) cho tuần hiện tại
  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) =>
      addDays(currentWeekStart, i)
    );
  }, [currentWeekStart]);

  // Convert timetable array to map for quick lookup
  const timetableMap = useMemo(() => {
    const map = {};
    timetable.forEach((day) => {
      map[day.date] = day;
    });
    return map;
  }, [timetable]);

  // Hàm điều hướng tuần
  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  if (!timetable || timetable.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Không có lịch thi nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Thời Khóa Biểu Thi</h2>
            <p className="text-blue-100 text-sm mt-1">
              Tuần: {format(weekDays[0], "dd/MM")} -{" "}
              {format(weekDays[5], "dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevWeek}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Tuần trước
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToday}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Hôm nay
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNextWeek}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Tuần sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Giao diện Lịch Tuần - Grid 6 cột (T2-T7) */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 lg:gap-4">
          {weekDays.map((date) => {
            const dateString = format(date, "yyyy-MM-dd");
            const dayData = timetableMap[dateString] || {
              date: dateString,
              morning: [],
              afternoon: [],
            };

            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={date.toISOString()}
                className={`rounded-lg bg-white border border-gray-200 min-h-[300px] shadow-sm ${
                  isToday ? "border-2 border-blue-500" : ""
                }`}
              >
                {/* Header của cột ngày */}
                <div
                  className={`p-3 text-center border-b ${
                    isToday ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-bold ${
                      isToday ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {format(date, "EEEE", { locale: vi })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(date, "dd/MM")}
                  </p>
                </div>

                {/* Nội dung các ca thi */}
                <div className="p-2 space-y-3">
                  {/* Ca Sáng */}
                  <div>
                    <h4 className="text-xs font-semibold text-orange-600 mb-2 pl-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> SÁNG
                    </h4>
                    <div className="space-y-2">
                      {dayData.morning.length > 0 ? (
                        dayData.morning.map((examEvent) => (
                          <ExamCard
                            key={examEvent.examId}
                            exam={examEvent}
                            onViewDetail={onViewDetail}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 px-1 pt-2 italic text-center">
                          -- Trống --
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ca Chiều */}
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-indigo-600 mb-2 pl-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> CHIỀU
                    </h4>
                    <div className="space-y-2">
                      {dayData.afternoon.length > 0 ? (
                        dayData.afternoon.map((examEvent) => (
                          <ExamCard
                            key={examEvent.examId}
                            exam={examEvent}
                            onViewDetail={onViewDetail}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 px-1 pt-2 italic text-center">
                          -- Trống --
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default TimetableGrid;
