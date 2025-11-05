import { useState } from "react";
// Thêm import cho date-fns và các icon mới
import { startOfWeek, addDays, format, subDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale"; // Thêm tiếng Việt
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Sparkles,
  ChevronLeft, // Icon mới
  ChevronRight, // Icon mới
} from "lucide-react";
// Bỏ import Table...
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import ExamCard from "./components/ExamCard"; // Component con (cũng được cập nhật)
import { Button } from "~/components/ui/button"; // Dùng cho nút Next/Prev
import { Textarea } from "~/components/ui/textarea"; // Dùng cho ô nhập JSON
const initialJsonData = `{
  "roomIds": [1,2,3,4,5],
  "lecturerIds": [1,2,3],
  "examSessionId": 1,
  "startDate": "2025-05-01",
  "endDate": "2025-06-01",
  "holidays": [
    "2025-05-01",
    "2025-05-15"
  ],
  "constraints": {
    "maxExamsPerStudentPerDay": 2,
    "avoidInterLocationTravel": true
  }
}`;
export function ScheduleGenerator() {
  const [jsonData, setJsonData] = useState(initialJsonData);
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State mới để quản lý tuần hiện tại
  // `weekStartsOn: 1` nghĩa là tuần bắt đầu vào Thứ 2
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    setError(null);
    setScheduleData(null);
    try {
      const parsedData = JSON.parse(jsonData);

      // Tự động nhảy đến tuần đầu tiên của kỳ thi
      if (parsedData.startDate) {
        setCurrentWeekStart(
          startOfWeek(new Date(parsedData.startDate), { weekStartsOn: 1 })
        );
      }

      const response = await fetch(
        "http://localhost:3000/scheduling/generate-advanced",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        }
      );

      const result = await response.json(); // API mới trả về { data: {...} }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Lỗi từ server: ${response.status} ${response.statusText}`
        );
      }

      const data = result.data ? result.data : result; // Hỗ trợ cả 2 kiểu response

      if (!data.timetable) {
        throw new Error("Định dạng dữ liệu trả về không hợp lệ.");
      }

      setScheduleData(data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Dữ liệu JSON đầu vào không hợp lệ. Vui lòng kiểm tra lại.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm điều hướng tuần
  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };
  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7));
  };

  // Tạo mảng 6 ngày (T2-T7) cho tuần hiện tại
  const weekDays = Array.from({ length: 6 }).map((_, i) =>
    addDays(currentWeekStart, i)
  );

  // Lấy thông tin từ JSON đầu vào (để hiển thị stats)
  const allExamGroups = scheduleData ? JSON.parse(jsonData).examGroups : [];
  const allRooms = scheduleData ? JSON.parse(jsonData).rooms : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xếp Lịch Thi Tự Động
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Hệ thống xếp lịch thi thông minh với thuật toán tối ưu
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="mb-6 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Dữ liệu đầu vào
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label
              htmlFor="jsonData"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
              Nhập dữ liệu JSON (Ngày thi, Nhóm thi, Phòng, Giám thị...)
            </label>
            <Textarea
              id="jsonData"
              rows={15}
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-mono
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Dán dữ liệu JSON của bạn vào đây..."
            />
          </div>
          <Button
            onClick={handleGenerateSchedule}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg
              shadow-lg hover:shadow-xl transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang xử lý thuật toán...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Tạo Lịch Thi Tự Động</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Thông báo lỗi */}
      {error && (
        <div className="relative w-full rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4 text-sm mb-6 shadow-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-red-900 mb-1">
                Có lỗi xảy ra!
              </h5>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* --- Phần Kết Quả --- */}
      {scheduleData && scheduleData.timetable && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-xl">Kết quả Lịch thi</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={scheduleData.isOptimal ? "default" : "secondary"}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border-blue-200"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Fitness: {scheduleData.fitness}
                </Badge>
                {scheduleData.isOptimal ? (
                  <Badge className="px-3 py-1 text-sm bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Tối ưu
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm">
                    Chưa tối ưu
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Thanh điều hướng tuần */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg border">
              <Button variant="outline" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Tuần trước
              </Button>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Tuần: {format(weekDays[0], "dd/MM")} -{" "}
                {format(weekDays[5], "dd/MM/yyyy")}
              </h3>
              <Button variant="outline" onClick={handleNextWeek}>
                Tuần sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Giao diện Lịch Tuần */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 lg:gap-4">
              {weekDays.map((date) => {
                // Tìm dữ liệu lịch thi cho ngày này
                const dateString = format(date, "yyyy-MM-dd");
                const dayData = scheduleData.timetable.find(
                  (d) => d.date === dateString
                );

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
                          {dayData && dayData.morning.length > 0 ? (
                            dayData.morning.map((exam) => (
                              <ExamCard key={exam.examGroup} exam={exam} />
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
                          {dayData && dayData.afternoon.length > 0 ? (
                            dayData.afternoon.map((exam) => (
                              <ExamCard key={exam.examGroup} exam={exam} />
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
