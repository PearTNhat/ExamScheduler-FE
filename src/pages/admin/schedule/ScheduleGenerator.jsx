import { useState } from "react";
// Import Accordion từ Radix UI
import { Loader2, AlertCircle, CheckCircle2, Badge } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ExamCard from "./components/ExamCard";

// Dữ liệu JSON mẫu giữ nguyên
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
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Thay thế Card bằng div với style của Tailwind */}
      <div className="bg-white rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight text-2xl">
            Trình tạo Lịch thi Nâng cao
          </h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <label
              htmlFor="jsonData"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dữ liệu đầu vào (JSON)
            </label>
            {/* Thay thế Textarea bằng thẻ textarea với style */}
            <textarea
              id="jsonData"
              rows={15}
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder="Dán dữ liệu JSON của bạn vào đây..."
            />
          </div>
          {/* Thay thế Button bằng thẻ button với style */}
          <button
            onClick={handleGenerateSchedule}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Đang xử lý..." : "Tạo Lịch Thi"}
          </button>
        </div>
      </div>

      {error && (
        // Thay thế Alert bằng div với style
        <div className="relative w-full rounded-lg border px-4 py-3 text-sm border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertCircle className="h-4 w-4 absolute left-4 top-4" />
          <h5 className="mb-1 font-medium leading-none tracking-tight ml-6">
            Lỗi!
          </h5>
          <div className="text-sm [&_p]:leading-relaxed ml-6">{error}</div>
        </div>
      )}

      {/* PHẦN HIỂN THỊ KẾT QUẢ SẼ ĐƯỢC THAY ĐỔI */}
      {scheduleData && scheduleData.timetable && (
        <Card>
          <CardHeader>
            {/* Phần CardHeader với Fitness và status giữ nguyên */}
            <CardTitle className="flex items-center justify-between">
              <span>Kết quả Lịch thi</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={scheduleData.isOptimal ? "default" : "secondary"}
                >
                  Fitness: {scheduleData.fitness}
                </Badge>
                {scheduleData.isOptimal ? (
                  <Badge
                    variant="success"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Tối ưu
                  </Badge>
                ) : (
                  <Badge variant="destructive">Chưa tối ưu</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] font-bold border-r">
                    Ngày
                  </TableHead>
                  <TableHead className="w-[80px] font-bold border-r">
                    Ca
                  </TableHead>
                  {allRooms.map((room) => (
                    <TableHead
                      key={room.roomId}
                      className="font-bold border-r text-center"
                    >
                      {room.roomId} ({room.location})
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.timetable.map((dayData, dayIndex) => (
                  <>
                    {/* Hàng cho ca SÁNG */}
                    <TableRow key={`${dayData.day}-sang`}>
                      {dayIndex % 2 === 0 && ( // Chỉ hiển thị tên ngày ở ca sáng để gộp ô
                        <TableCell
                          rowSpan={2}
                          className="font-semibold border-r align-middle text-center"
                        >
                          {dayData.day}
                        </TableCell>
                      )}
                      <TableCell className="font-semibold border-r">
                        Sáng
                      </TableCell>
                      {allRooms.map((room) => (
                        <TableCell
                          key={room.roomId}
                          className="border-r p-1 align-top"
                        >
                          {dayData.morning[room.roomId]?.map((exam) => (
                            <ExamCard key={exam.subject} exam={exam} />
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Hàng cho ca CHIỀU */}
                    <TableRow key={`${dayData.day}-chieu`}>
                      {/* Tên ngày đã được render và gộp ở trên */}
                      <TableCell className="font-semibold border-r">
                        Chiều
                      </TableCell>
                      {allRooms.map((room) => (
                        <TableCell
                          key={room.roomId}
                          className="border-r p-1 align-top"
                        >
                          {dayData.afternoon[room.roomId]?.map((exam) => (
                            <ExamCard key={exam.subject} exam={exam} />
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
