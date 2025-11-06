import { useState, useMemo, useEffect } from "react";
import { startOfWeek, addDays, format, subDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
} from "lucide-react";
import { getColorClass } from "../utils/helper";
const TimetableGrid = ({
  exams = [],
  startDate, // <-- ĐÃ THÊM
  onViewDetail,
  onEdit,
}) => {
  // State để quản lý tuần hiện tại (bắt đầu từ Thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // *** ĐÃ THÊM: Đồng bộ với bộ lọc của component cha ***
  useEffect(() => {
    if (startDate) {
      // Nếu cha có lọc ngày, nhảy đến tuần của ngày đó
      // Phải parse ngày theo múi giờ địa phương
      const dateParts = startDate.split("-").map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      setCurrentWeekStart(startOfWeek(localDate, { weekStartsOn: 1 }));
    } else {
      // Nếu cha reset bộ lọc, quay về tuần hiện tại
      setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    }
  }, [startDate]); // Chạy lại khi startDate từ cha thay đổi
  // *** KẾT THÚC THAY ĐỔI ***

  // Tạo mảng 6 ngày (T2-T7) cho tuần hiện tại
  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) =>
      addDays(currentWeekStart, i)
    );
  }, [currentWeekStart]);

  // Group exams by date and session (morning/afternoon)
  const timetableData = useMemo(() => {
    if (!exams || exams.length === 0) return {};

    const grouped = {};

    exams.forEach((exam) => {
      const examDate = exam.examDate || exam.exam_date;
      if (!examDate) return;

      const dateString = format(new Date(examDate), "yyyy-MM-dd");

      if (!grouped[dateString]) {
        grouped[dateString] = {
          date: dateString,
          morning: [],
          afternoon: [],
        };
      }

      // Determine if morning or afternoon based on slot time
      const slot = exam.examSlot || exam.slot;
      const startTime = slot?.start_time || slot?.startTime || "";

      if (startTime) {
        const hour = parseInt(startTime.split(":")[0]);
        if (hour < 12) {
          grouped[dateString].morning.push(exam);
        } else {
          grouped[dateString].afternoon.push(exam);
        }
      } else {
        // Default to afternoon if no time
        grouped[dateString].afternoon.push(exam);
      }
    });

    return grouped;
  }, [exams]);

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

  if (!exams || exams.length === 0) {
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
            const dayData = timetableData[dateString] || {
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
                        dayData.morning.map((exam) => (
                          <ExamCard
                            key={exam.id}
                            exam={exam}
                            onViewDetail={onViewDetail}
                            onEdit={onEdit}
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
                        dayData.afternoon.map((exam) => (
                          <ExamCard
                            key={exam.id}
                            exam={exam}
                            onViewDetail={onViewDetail}
                            onEdit={onEdit}
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

// Exam Card Component - Tương tự ScheduleGenerator
const ExamCard = ({ exam, onViewDetail, onEdit }) => {
  // Extract exam data
  const courseName = exam.exam_group?.course?.name || exam.courseName || "N/A";
  const courseCode = exam.exam_group?.course?.code || exam.courseCode || "";
  const examGroupCode = exam.exam_group?.code || "";
  const roomCode = exam.room?.code || exam.roomName || "N/A";
  const locationName = exam.room?.location?.name || exam.location || "";
  const studentCount =
    exam.exam_group?.expected_student_count || exam.studentCount || 0;

  const slot = exam.examSlot || exam.slot;
  const startTime = slot?.start_time || slot?.startTime || "";
  const endTime = slot?.end_time || slot?.endTime || "";
  const duration = exam.duration || slot?.duration || 90;

  // Hàm tạo màu ngẫu nhiên (giống ScheduleGenerator)

  const colorClass = getColorClass(examGroupCode || exam.id);

  return (
    <div
      className={`rounded-lg border ${colorClass.border} ${colorClass.bg} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onViewDetail(exam.id)}
    >
      <div className="p-3">
        {/* Hàng 1: Tên nhóm và Sĩ số */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <BookOpen
                className={`h-3.5 w-3.5 ${colorClass.text} flex-shrink-0`}
              />
              <p
                className={`font-bold text-sm ${colorClass.text} truncate`}
                title={examGroupCode}
              >
                {examGroupCode}
              </p>
            </div>
            <p className="text-xs text-gray-600 truncate" title={courseName}>
              {courseName}
            </p>
          </div>
          <Badge className={`${colorClass.badge} text-xs flex-shrink-0`}>
            <Users className="h-3 w-3 mr-1" />
            {studentCount}
          </Badge>
        </div>

        {/* Hàng 2: Thông tin chi tiết */}
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium">
              {startTime} - {endTime}
            </span>
            <span className="text-gray-400">•</span>
            <span>{duration} phút</span>
          </div>

          {/* Hiển thị phòng thi và địa điểm */}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-600 truncate">
              <span className="font-medium text-gray-700">{roomCode}</span>
              {locationName && (
                <span className="text-gray-500"> ({locationName})</span>
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(exam.id);
            }}
            className="flex-1 h-7 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Xem
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exam);
            }}
            className="flex-1 h-7 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
