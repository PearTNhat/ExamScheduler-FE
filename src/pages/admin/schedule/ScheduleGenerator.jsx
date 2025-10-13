import { useState } from "react";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import ExamCard from "./components/ExamCard";

// Dữ liệu JSON mẫu với tên đẹp hơn
const initialJsonData = `{
  "students": [
    { "studentId": "SV001", "subjects": ["CS101", "MA101", "EN101"] },
    { "studentId": "SV002", "subjects": ["CS101", "PH102", "MA101"] },
    { "studentId": "SV003", "subjects": ["EC201", "HI101", "EN101"] },
    { "studentId": "SV004", "subjects": ["CS202", "CS205L", "MA201"] },
    { "studentId": "SV005", "subjects": ["PH102", "PH103L", "MA101"] },
    { "studentId": "SV006", "subjects": ["CS101", "CS202", "EN101"] },
    { "studentId": "SV007", "subjects": ["HI101", "EC201", "SO101"] },
    { "studentId": "SV008", "subjects": ["MA201", "CS205L", "PH102"] },
    { "studentId": "SV009", "subjects": ["CS101", "EN101"] },
    { "studentId": "SV010", "subjects": ["PH102", "MA101"] },
    { "studentId": "SV011", "subjects": ["EC201", "MA101", "HI101"] },
    { "studentId": "SV012", "subjects": ["CS101", "CS202", "CS205L"] },
    { "studentId": "SV013", "subjects": ["SO101", "EN101", "HI101"] },
    { "studentId": "SV014", "subjects": ["PH102", "PH103L"] },
    { "studentId": "SV015", "subjects": ["CS101", "EC201"] },
    { "studentId": "SV016", "subjects": ["CS301", "CS305", "MA201"] },
    { "studentId": "SV017", "subjects": ["HI101", "EN101", "SO101"] },
    { "studentId": "SV018", "subjects": ["PH102", "CS101"] },
    { "studentId": "SV019", "subjects": ["MA201", "EC201", "CS202"] },
    { "studentId": "SV020", "subjects": ["CS101", "MA101", "PH102", "EN101"] },
    { "studentId": "SV021", "subjects": ["CS101", "MA101"] },
    { "studentId": "SV022", "subjects": ["PH102", "PH103L"] },
    { "studentId": "SV023", "subjects": ["EC201", "HI101"] },
    { "studentId": "SV024", "subjects": ["CS202", "CS205L"] },
    { "studentId": "SV025", "subjects": ["SO101", "EN101"] },
    { "studentId": "SV026", "subjects": ["CS101", "MA201"] },
    { "studentId": "SV027", "subjects": ["HI101", "EC201"] },
    { "studentId": "SV028", "subjects": ["CS301", "CS305"] },
    { "studentId": "SV029", "subjects": ["MA101", "PH102"] },
    { "studentId": "SV030", "subjects": ["CS101", "HI101"] },
    { "studentId": "SV031", "subjects": ["EC201", "EN101"] },
    { "studentId": "SV032", "subjects": ["CS202", "MA201"] },
    { "studentId": "SV033", "subjects": ["PH103L", "MA101"] },
    { "studentId": "SV034", "subjects": ["SO101", "HI101"] },
    { "studentId": "SV035", "subjects": ["CS101", "CS301"] },
    { "studentId": "SV036", "subjects": ["MA101", "EC201"] },
    { "studentId": "SV037", "subjects": ["EN101", "HI101"] },
    { "studentId": "SV038", "subjects": ["CS205L", "PH102"] },
    { "studentId": "SV039", "subjects": ["CS305", "MA201"] },
    { "studentId": "SV040", "subjects": ["CS101", "MA101", "EN101"] },
    { "studentId": "SV041", "subjects": ["PH102", "CS101"] },
    { "studentId": "SV042", "subjects": ["EC201", "SO101"] },
    { "studentId": "SV043", "subjects": ["CS202", "HI101"] },
    { "studentId": "SV044", "subjects": ["PH103L", "CS205L"] },
    { "studentId": "SV045", "subjects": ["MA101", "EN101"] },
    { "studentId": "SV046", "subjects": ["CS101", "CS202"] },
    { "studentId": "SV047", "subjects": ["HI101", "PH102"] },
    { "studentId": "SV048", "subjects": ["MA201", "CS301"] },
    { "studentId": "SV049", "subjects": ["EC201", "CS101"] },
    { "studentId": "SV050", "subjects": ["SO101", "MA101"] },
    { "studentId": "SV051", "subjects": ["EN101", "PH102"] },
    { "studentId": "SV052", "subjects": ["CS205L", "MA201"] },
    { "studentId": "SV053", "subjects": ["CS305", "HI101"] },
    { "studentId": "SV054", "subjects": ["CS101", "PH103L"] },
    { "studentId": "SV055", "subjects": ["MA101", "CS202"] },
    { "studentId": "SV056", "subjects": ["EC201", "CS301"] },
    { "studentId": "SV057", "subjects": ["HI101", "MA201"] },
    { "studentId": "SV058", "subjects": ["SO101", "CS101"] },
    { "studentId": "SV059", "subjects": ["EN101", "CS205L"] },
    { "studentId": "SV060", "subjects": ["PH102", "CS305"] },
    { "studentId": "SV061", "subjects": ["CS101", "MA101"] },
    { "studentId": "SV062", "subjects": ["EC201", "EN101"] },
    { "studentId": "SV063", "subjects": ["HI101", "PH102"] },
    { "studentId": "SV064", "subjects": ["MA201", "CS202"] },
    { "studentId": "SV065", "subjects": ["CS205L", "SO101"] },
    { "studentId": "SV066", "subjects": ["CS301", "CS101"] },
    { "studentId": "SV067", "subjects": ["CS305", "MA101"] },
    { "studentId": "SV068", "subjects": ["PH103L", "EC201"] },
    { "studentId": "SV069", "subjects": ["EN101", "HI101"] },
    { "studentId": "SV070", "subjects": ["CS101", "PH102"] },
    { "studentId": "SV071", "subjects": ["MA101", "HI101"] },
    { "studentId": "SV072", "subjects": ["EC201", "CS202"] },
    { "studentId": "SV073", "subjects": ["SO101", "MA201"] },
    { "studentId": "SV074", "subjects": ["CS205L", "EN101"] },
    { "studentId": "SV075", "subjects": ["CS301", "PH102"] },
    { "studentId": "SV076", "subjects": ["CS305", "EC201"] },
    { "studentId": "SV077", "subjects": ["PH103L", "HI101"] },
    { "studentId": "SV078", "subjects": ["MA101", "SO101"] },
    { "studentId": "SV079", "subjects": ["CS101", "EN101"] },
    { "studentId": "SV080", "subjects": ["PH102", "EC201", "CS202", "MA101"] }
  ],
  "subjects": [
    { "subjectId": "CS101", "duration": 90 },
    { "subjectId": "MA101", "duration": 90 },
    { "subjectId": "PH102", "duration": 90 },
    { "subjectId": "EN101", "duration": 60 },
    { "subjectId": "HI101", "duration": 60 },
    { "subjectId": "EC201", "duration": 120 },
    { "subjectId": "SO101", "duration": 60 },
    { "subjectId": "CS202", "duration": 90 },
    { "subjectId": "MA201", "duration": 120 },
    { "subjectId": "PH103L", "duration": 180 },
    { "subjectId": "CS205L", "duration": 180 },
    { "subjectId": "CS301", "duration": 90 },
    { "subjectId": "CS305", "duration": 120 },
    { "subjectId": "CH101", "duration": 90 },
    { "subjectId": "BI101", "duration": 90 }
  ],
  "rooms": [
    { "roomId": "A101", "capacity": 80, "location": "Khu A" },
    { "roomId": "A102", "capacity": 80, "location": "Khu A" },
    { "roomId": "B201", "capacity": 40, "location": "Khu B" },
    { "roomId": "B202", "capacity": 40, "location": "Khu B" },
    { "roomId": "C301", "capacity": 25, "location": "Khu C" },
    { "roomId": "C302", "capacity": 25, "location": "Khu C" },
    { "roomId": "D401", "capacity": 100, "location": "Khu D (Hội trường)" },
    { "roomId": "LAB-B1", "capacity": 30, "location": "Khu B" }
  ],
  "proctors": [
    { "proctorId": "GV01" },
    { "proctorId": "GV02" },
    { "proctorId": "GV03" },
    { "proctorId": "GV04" },
    { "proctorId": "GV05" },
    { "proctorId": "GV06" },
    { "proctorId": "GV07" },
    { "proctorId": "GV08" },
    { "proctorId": "GV09" },
    { "proctorId": "GV10" }
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

  const handleGenerateSchedule = async () => {
    // Logic xử lý không thay đổi
    setIsLoading(true);
    setError(null);
    setScheduleData(null);
    try {
      const parsedData = JSON.parse(jsonData);
      const response = await fetch(
        "http://localhost:3000/scheduling/generate-advanced",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Lỗi từ server: ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();
      console.log(result);
      setScheduleData(result.data);
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
  const allRooms = scheduleData ? JSON.parse(jsonData).rooms : [];
  const allSubjects = scheduleData ? JSON.parse(jsonData).subjects : [];

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
              Nhập dữ liệu JSON (Sinh viên, Môn học, Phòng thi, Giám thị)
            </label>
            <textarea
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
          <button
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
          </button>
        </CardContent>
      </Card>

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

      {/* Result Section */}
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
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">
                      Số ngày thi
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {scheduleData.timetable.length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium mb-1">
                      Số phòng thi
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {allRooms.length}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Tổng ca thi
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {scheduleData.timetable.length * 2}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium mb-1">
                      Môn thi
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {allSubjects.length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600 opacity-80" />
                </div>
              </div>
            </div>

            {/* Timetable */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <TableHead className="w-[100px] font-bold border-r bg-gray-100 sticky left-0 z-10">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Ngày
                      </div>
                    </TableHead>
                    <TableHead className="w-[80px] font-bold border-r bg-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Ca
                      </div>
                    </TableHead>
                    {allRooms.map((room) => (
                      <TableHead
                        key={room.roomId}
                        className="font-bold border-r text-center min-w-[200px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 font-semibold text-gray-900">
                            <MapPin className="h-4 w-4" />
                            {room.roomId}
                          </div>
                          <span className="text-xs font-normal text-gray-600">
                            {room.location}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {room.capacity} chỗ
                          </Badge>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.timetable.map((dayData, dayIndex) => (
                    <>
                      {/* Morning Session */}
                      <TableRow
                        key={`${dayData.day}-morning`}
                        className="hover:bg-gray-50"
                      >
                        {dayIndex % 2 === 0 && (
                          <TableCell
                            rowSpan={2}
                            className="font-bold border-r align-middle text-center bg-blue-50 sticky left-0 z-10"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <span className="text-sm">{dayData.day}</span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="font-semibold border-r bg-yellow-50 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Sáng</span>
                          </div>
                        </TableCell>
                        {allRooms.map((room) => (
                          <TableCell
                            key={room.roomId}
                            className="border-r p-2 align-top bg-white"
                          >
                            {dayData.morning[room.roomId]?.map((exam) => (
                              <ExamCard
                                key={exam.subject}
                                exam={exam}
                                allSubjects={allSubjects}
                              />
                            ))}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Afternoon Session */}
                      <TableRow
                        key={`${dayData.day}-afternoon`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-semibold border-r bg-indigo-50 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Clock className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm">Chiều</span>
                          </div>
                        </TableCell>
                        {allRooms.map((room) => (
                          <TableCell
                            key={room.roomId}
                            className="border-r p-2 align-top bg-white"
                          >
                            {dayData.afternoon[room.roomId]?.map((exam) => (
                              <ExamCard
                                key={exam.subject}
                                exam={exam}
                                allSubjects={allSubjects}
                              />
                            ))}
                          </TableCell>
                        ))}
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
