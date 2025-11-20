import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // <-- ĐÃ THÊM
import { Play, Pause, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import RoomSelector from "./components/RoomSelector";
import ProctorSelector from "./components/ProctorSelector";
import DateRangeSelector from "./components/DateRangeSelector";
import ExamSessionSelector from "./components/ExamSessionSelector";
import ConstraintsConfiguration from "./components/ConstraintsConfiguration";
import {
  showAlertError,
  showToastError,
  showToastWarning,
  showToastSuccess,
} from "~/utils/alert";
import { apiGenerateExamSchedule, apiGetExamHistory } from "~/apis/examsApi";

const AutoSchedule = () => {
  const { accessToken } = useSelector((state) => state.user); // <-- ĐÃ THÊM

  // Exam Session
  const [selectedSessionId, setSelectedSessionId] = useState("");
  // Date Range
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-31");

  // Data from API when session is selected
  const [examHistoryData, setExamHistoryData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedProctors, setSelectedProctors] = useState([]);
  const [constraints, setConstraints] = useState([
    {
      constraintCode: "HOLIDAY",
      rule: {
        holiday: ["2025-05-01", "2025-05-15"],
      },
    },
    {
      constraintCode: "MAX_EXAMS_PER_DAY",
      rule: {
        max_exam_per_day: 2,
      },
    },
    {
      constraintCode: "ROOM_LOCATION_LIMIT",
      rule: {
        max_location: 1,
      },
    },
  ]);
  // Scheduling State
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  // Load exam history data when session is selected
  useEffect(() => {
    if (!selectedSessionId) {
      setExamHistoryData(null);
      setSelectedRooms([]);
      setSelectedProctors([]);
      return;
    }
    const loadExamHistory = async () => {
      try {
        const response = await apiGetExamHistory({
          examSessionId: parseInt(selectedSessionId),
        });

        if (response.code === 200) {
          const data = response.data;
          setExamHistoryData(data);

          // Update date range from API
          if (data.startDate) setStartDate(data.startDate);
          if (data.endDate) setEndDate(data.endDate);
          if (data.rooms && data.rooms.length > 0) {
            const historyRooms = data.rooms.map((room) => ({
              roomId: room.id,
              capacity: room.capacity,
              location: room?.locationName || "N/A",
              locationId: room.locationId,
              roomType: room.roomType,
              code: room.roomCode,
            }));
            setSelectedRooms(historyRooms);
          } else {
            setSelectedRooms([]); // Xóa nếu lịch sử không có phòng
          }
          if (data.lecturers && data.lecturers.length > 0) {
            const historyProctors = data.lecturers.map((lecturer) => ({
              proctorId: lecturer.id,
              name: lecturer.name,
              lecturerCode: lecturer.lectureCode,
              unavailable_dates:
                lecturer.unavailable_dates?.map((d) => ({
                  date: d.date,
                  slotId: d.slotId,
                })) || [],
            }));
            setSelectedProctors(historyProctors);
          } else {
            setSelectedProctors([]); // Xóa nếu lịch sử không có giám thị
          }
          // Update constraints from API
          if (data.constraints) {
            setConstraints(data.constraints);
          }
        }
      } catch (error) {
        showToastError("Lỗi khi tải thông tin đợt thi", error.message);
      }
    };

    loadExamHistory();
  }, [selectedSessionId]);

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
    setResults(null); // Xóa kết quả cũ
    try {
      let rooms = examHistoryData?.rooms || [];
      if (selectedRooms.length > 0) {
        rooms = selectedRooms.map((room) => ({
          id: room.roomId,
          capacity: room.capacity,
          locationId: room.locationId,
          roomCode: room.code,
          roomType: room.roomType,
          locationName: room.location,
        }));
      }
      let lecturers = examHistoryData?.lecturers || [];
      if (selectedProctors.length > 0) {
        lecturers = selectedProctors.map((proctor) => ({
          id: proctor.proctorId,
          name: proctor.name,
          lecturerCode: proctor.lecturerCode,
          unavailable_dates:
            proctor.unavailable_dates?.map((d) => ({
              date: d.date,
              slotId: d.slotId,
            })) || [],
        }));
      }
      const schedulingData = {
        rooms: rooms,
        lecturers: lecturers,
        examSessionId: parseInt(selectedSessionId),
        startDate: startDate,
        endDate: endDate,
        constraints: constraints, // Use constraints array directly
      };
      const res = await apiGenerateExamSchedule({
        accessToken,
        body: schedulingData,
      });

      if (res.code != 200) {
        throw new Error(res.message || "Lỗi từ server khi xếp lịch");
      }
      const result = res.data;
      setIsRunning(false);
      setResults({
        success: true,
        fitness: result.fitness,
        isOptimal: result.isOptimal,
        timetable: result.timetable,
        totalScheduled: result.timetable?.length || 0,
      });

      showToastSuccess("Xếp lịch thành công!");
    } catch (error) {
      console.error("Scheduling error:", error);
      setIsRunning(false);
      showAlertError(error.message || "Có lỗi xảy ra khi xếp lịch!");
      setResults({
        success: false,
        error: error.message,
      });
    }
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

          {/* Room Selector */}
          <RoomSelector
            selectedRooms={selectedRooms}
            onRoomsChange={setSelectedRooms}
          />

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
                  disabled={!selectedSessionId || !accessToken}
                  className="w-full"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Bắt đầu xếp lịch
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800">
                      Đang xếp lịch...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Quá trình này có thể mất vài phút
                    </div>
                  </div>
                </div>
              )}

              {!selectedSessionId && (
                <p className="text-sm text-amber-600 text-center">
                  ⚠️ Vui lòng chọn đợt thi
                </p>
              )}
            </CardContent>
          </Card>
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
        </div>
      </div>
    </div>
  );
};

export default AutoSchedule;
