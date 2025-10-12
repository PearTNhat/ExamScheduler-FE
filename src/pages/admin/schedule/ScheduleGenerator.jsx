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
    { "studentId": "SV001", "subjects": ["MATH101", "PHYS102"] },
    { "studentId": "SV002", "subjects": ["MATH101", "CS101"] },
    { "studentId": "SV003", "subjects": ["PHYS102", "ENG101", "CS101"] },
    { "studentId": "SV004", "subjects": ["MATH101", "ENG101"] }
  ],
  "subjects": [
    { "subjectId": "MATH101", "duration": 90 },
    { "subjectId": "PHYS102", "duration": 60 },
    { "subjectId": "CS101", "duration": 120 },
    { "subjectId": "ENG101", "duration": 60 }
  ],
  "rooms": [
    { "roomId": "P101", "capacity": 30, "location": "Khu A" },
    { "roomId": "P102", "capacity": 25, "location": "Khu A" },
    { "roomId": "P301", "capacity": 40, "location": "Khu B" }
  ],
  "proctors": [
    { "proctorId": "GV01" },
    { "proctorId": "GV02" },
    { "proctorId": "GV03" }
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
