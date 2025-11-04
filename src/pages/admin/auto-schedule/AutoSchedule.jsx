import { useState } from "react";
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  Zap,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import RoomSelector from "./components/RoomSelector";
import ProctorSelector from "./components/ProctorSelector";
import HolidaySelector from "./components/HolidaySelector";
import DateRangeSelector from "./components/DateRangeSelector";
import ExamSessionSelector from "./components/ExamSessionSelector";
import ConstraintsConfiguration from "./components/ConstraintsConfiguration";
import {
  showAlertError,
  showAlertSuccess,
  showAlertInfo,
  showToastError,
  showToastSuccess,
  showToastWarning,
} from "~/utils/alert";
import { apiGenerateExamSchedule } from "~/apis/examsApi";

const AutoSchedule = () => {
  // Exam Session
  const [selectedSessionId, setSelectedSessionId] = useState("");
  // Date Range
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-31");
  // Holidays
  const [holidays, setHolidays] = useState(["2025-05-01", "2025-05-15"]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedProctors, setSelectedProctors] = useState([]);
  // Constraints
  const [constraints, setConstraints] = useState({
    maxExamsPerStudentPerDay: {
      value: 2,
      type: "Hard",
    },
    avoidInterLocationTravel: {
      value: true,
      type: "Hard",
    },
  });

  // Scheduling State
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState(null);

  const handleStartScheduling = async () => {
    // Validation
    if (!selectedSessionId) {
      showToastWarning("Vui lòng chọn đợt thi!");
      return;
    }

    if (!startDate || !endDate) {
      showToastWarning("Vui lòng chọn thời gian bắt đầu và kết thúc!");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showToastError("Ngày bắt đầu phải trước ngày kết thúc!");
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setCurrentStep("Đang chuẩn bị dữ liệu...");

    try {
      // Prepare data
      const schedulingData = {
        examSessionId: parseInt(selectedSessionId),
        holidays: holidays,
        startDate: startDate,
        endDate: endDate,
        constraints: constraints,
        proctors: selectedProctors, // Empty array = select all
        rooms: selectedRooms, // Empty array = select all
      };
      setCurrentStep("Đang gửi yêu cầu xếp lịch...");
      setProgress(20);

      const res = await apiGenerateExamSchedule({
        accessToken,
        schedulingData,
      });
      if (res.code != 200) {
        throw new Error(res.message || "Lỗi từ server khi xếp lịch");
      }
      const result = res.data;
      // setProgress(60);
      // setCurrentStep("Đang xử lý kết quả...");
      setProgress(100);
      setCurrentStep("Hoàn thành!");
      setIsRunning(false);
      // Set results
      setResults({
        success: true,
        fitness: result.fitness,
        isOptimal: result.isOptimal,
        timetable: result.timetable,
        totalScheduled: result.timetable?.length || 0,
      });

      showAlertSuccess("Xếp lịch thành công!");
    } catch (error) {
      console.error("Scheduling error:", error);
      setIsRunning(false);
      setCurrentStep("Lỗi!");
      showAlertError(error.message || "Có lỗi xảy ra khi xếp lịch!");
      setResults({
        success: false,
        error: error.message,
      });
    }
  };

  const handleStopScheduling = () => {
    setIsRunning(false);
    setCurrentStep("Đã dừng");
    showToastWarning("Đã dừng quá trình xếp lịch");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xếp lịch tự động</h1>
        <p className="mt-2 text-gray-600">
          Cấu hình thông tin và chạy thuật toán xếp lịch thi tự động
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="xl:col-span-2 space-y-6">
          <ExamSessionSelector
            selectedSessionId={selectedSessionId}
            onSessionChange={setSelectedSessionId}
          />

          {/* Date Range Selector */}
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Holiday Selector */}
          <HolidaySelector holidays={holidays} onHolidaysChange={setHolidays} />

          {/* Room Selector */}
          <RoomSelector
            selectedRooms={selectedRooms}
            onRoomsChange={setSelectedRooms}
          />

          {/* Proctor Selector */}
          <ProctorSelector
            selectedProctors={selectedProctors}
            onProctorsChange={setSelectedProctors}
          />

          {/* Constraints Configuration */}
          <ConstraintsConfiguration
            constraints={constraints}
            onConstraintsChange={setConstraints}
          />
        </div>

        {/* Right Column - Control & Results */}
        <div className="space-y-6">
          {/* Control Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Điều khiển</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isRunning ? (
                <Button
                  onClick={handleStartScheduling}
                  disabled={!selectedSessionId}
                  className="w-full"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Bắt đầu xếp lịch
                </Button>
              ) : (
                <Button
                  onClick={handleStopScheduling}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Dừng xếp lịch
                </Button>
              )}

              {!selectedSessionId && (
                <p className="text-sm text-amber-600 text-center">
                  ⚠️ Vui lòng chọn đợt thi
                </p>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          {(isRunning || progress > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Tiến độ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="text-sm font-medium text-gray-900">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {currentStep && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{currentStep}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Kết quả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.success ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">
                        {results.isOptimal
                          ? "Xếp lịch tối ưu thành công!"
                          : "Xếp lịch hoàn tất!"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-gray-600">Fitness Score</div>
                        <div className="text-xl font-bold text-blue-600">
                          {results.fitness}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-gray-600">Đã xếp lịch</div>
                        <div className="text-xl font-bold text-green-600">
                          {results.totalScheduled}
                        </div>
                      </div>
                    </div>

                    {results.isOptimal && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                        ✅ Đã tìm được lịch thi tối ưu hoàn hảo (fitness = 0)!
                      </div>
                    )}

                    {results.timetable && results.timetable.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          console.log("Timetable:", results.timetable);
                          showAlertInfo(
                            `Có ${results.timetable.length} lịch thi đã được tạo. Xem console để biết chi tiết.`
                          );
                        }}
                      >
                        Xem chi tiết lịch thi
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-red-700">
                        Xếp lịch thất bại
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                      {results.error || "Có lỗi xảy ra"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Panel */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Lưu ý</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Chọn "Tất cả" = Gửi mảng rỗng</li>
                    <li>• Hard constraints: Bắt buộc thỏa mãn</li>
                    <li>• Soft constraints: Tối ưu hóa</li>
                    <li>• Có thể mất vài phút</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoSchedule;
