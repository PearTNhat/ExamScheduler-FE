import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import StudentPickerModal from "../view-schedule/components/StudentPickerModal";
import ProctorPickerModal from "../components/ProctorPickerModal";
import { apiExamStudent } from "~/apis/studentsApi";
import { apiExamLecturer } from "~/apis/lecturesApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showErrorToast, showSuccessToast } from "~/utils/alert";
import {
  Loader2,
  Search,
  Calendar,
  MapPin,
  Clock,
  BookOpen,
} from "lucide-react";

export default function ExamStudentLecture() {
  const { accessToken } = useSelector((state) => state.user);
  const [roleType, setRoleType] = useState("student");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedExamSession, setSelectedExamSession] = useState(null);
  const [examSessions, setExamSessions] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Load exam sessions on component mount
  useEffect(() => {
    const fetchExamSessions = async () => {
      setLoadingSessions(true);
      try {
        const response = await apiGetExamSessions({ accessToken });
        if (response.statusCode === 200 && response.data) {
          setExamSessions(response.data);
          // Auto-select first exam session if available
          if (response.data.length > 0) {
            setSelectedExamSession(response.data[0].id);
          }
        } else {
          showErrorToast("Không thể tải danh sách kỳ thi");
        }
      } catch (error) {
        showErrorToast("Có lỗi xảy ra khi tải danh sách kỳ thi");
        console.error(error);
      } finally {
        setLoadingSessions(false);
      }
    };

    if (accessToken) {
      fetchExamSessions();
    }
  }, [accessToken]);

  const handleRoleChange = (value) => {
    setRoleType(value);
    setSelectedPerson(null);
    setExamData(null);
  };

  const handleStudentSelect = (students) => {
    if (students.length > 0) {
      setSelectedPerson(students[0]);
      setShowStudentModal(false);
    }
  };

  const handleLecturerSelect = (lecturers) => {
    if (lecturers.length > 0) {
      setSelectedPerson(lecturers[0]);
      setShowLecturerModal(false);
    }
  };

  const handleFetchExamSchedule = async () => {
    if (!selectedExamSession) {
      showErrorToast("Vui lòng chọn kỳ thi");
      return;
    }

    if (!selectedPerson) {
      showErrorToast("Vui lòng chọn sinh viên hoặc giảng viên");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (roleType === "student") {
        response = await apiExamStudent({
          accessToken,
          studentId: selectedPerson.id,
          examSessionId: selectedExamSession,
        });
      } else {
        response = await apiExamLecturer({
          accessToken,
          lecturerId: selectedPerson.id,
          examSessionId: selectedExamSession,
        });
      }

      if (
        response.statusCode === 200 ||
        response.student ||
        response.lecturer
      ) {
        setExamData(response);
        showSuccessToast("Lấy lịch thi thành công!");
      } else {
        showErrorToast(response.message || "Không thể lấy lịch thi");
      }
    } catch (error) {
      showErrorToast("Có lỗi xảy ra khi lấy lịch thi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã công bố":
        return "bg-green-500";
      case "Chốt":
        return "bg-blue-500";
      case "Dự thảo":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tra cứu lịch thi</CardTitle>
          <CardDescription>
            Xem lịch thi của sinh viên hoặc lịch coi thi của giảng viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam Session Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Chọn kỳ thi</Label>
            {loadingSessions ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải danh sách kỳ thi...
              </div>
            ) : (
              <Select
                value={selectedExamSession?.toString()}
                onValueChange={(value) =>
                  setSelectedExamSession(parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kỳ thi" />
                </SelectTrigger>
                <SelectContent>
                  {examSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      {session.name} - {session.academicYear?.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Đối tượng tra cứu</Label>
            <RadioGroup value={roleType} onValueChange={handleRoleChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="cursor-pointer">
                  Sinh viên
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lecturer" id="lecturer" />
                <Label htmlFor="lecturer" className="cursor-pointer">
                  Giảng viên
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Person Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {roleType === "student" ? "Chọn sinh viên" : "Chọn giảng viên"}
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                placeholder={
                  roleType === "student"
                    ? "Nhấn nút để chọn sinh viên..."
                    : "Nhấn nút để chọn giảng viên..."
                }
                value={
                  selectedPerson
                    ? roleType === "student"
                      ? `${selectedPerson.studentCode} - ${selectedPerson.lastName} ${selectedPerson.firstName}`
                      : `${selectedPerson.lecturerCode} - ${selectedPerson.lastName} ${selectedPerson.firstName}`
                    : ""
                }
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (roleType === "student") {
                    setShowStudentModal(true);
                  } else {
                    setShowLecturerModal(true);
                  }
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Chọn
              </Button>
            </div>
          </div>

          {/* Fetch Button */}
          <Button
            onClick={handleFetchExamSchedule}
            disabled={!selectedPerson || !selectedExamSession || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Xem lịch thi
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Exam Schedule Display */}
      {examData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {roleType === "student" ? "Lịch thi" : "Lịch coi thi"} -{" "}
              {examData.student?.name || examData.lecturer?.name}
            </CardTitle>
            <CardDescription>
              Mã số:{" "}
              {examData.student?.studentCode || examData.lecturer?.lecturerCode}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {examData.exams && examData.exams.length > 0 ? (
              <Table>
                <TableCaption>
                  Tổng số: {examData.exams.length}{" "}
                  {roleType === "student" ? "môn thi" : "ca coi thi"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Môn học
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày thi
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ca thi
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Phòng thi
                      </div>
                    </TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examData.exams.map((exam, index) => (
                    <TableRow key={exam.id || index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{exam.course}</div>
                          <div className="text-sm text-gray-500">
                            {exam.courseCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.slot}</TableCell>
                      <TableCell className="font-mono">{exam.room}</TableCell>
                      <TableCell>{exam.location}</TableCell>
                      <TableCell>{exam.duration} phút</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không có lịch thi nào
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <StudentPickerModal
        open={showStudentModal}
        onOpenChange={setShowStudentModal}
        onConfirm={handleStudentSelect}
        selectedStudents={selectedPerson ? [selectedPerson] : []}
      />

      <ProctorPickerModal
        open={showLecturerModal}
        onOpenChange={setShowLecturerModal}
        onConfirm={handleLecturerSelect}
        selectedProctors={selectedPerson ? [selectedPerson] : []}
        multiSelect={false}
      />
    </div>
  );
}
