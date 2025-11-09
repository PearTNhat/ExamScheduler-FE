import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  UserMinus,
  Save,
  X,
  GraduationCap,
  UserCheck,
  AlertCircle,
  Search,
} from "lucide-react";
import { apiGetDetailExamById, apiUpdateExam } from "~/apis/examsApi";
import { apiGetRooms } from "~/apis/roomsApi";
import { apiGetExamSlots } from "~/apis/exam-slotApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import ProctorPickerModal from "~/pages/admin/auto-schedule/components/ProctorPickerModal";
import StudentPickerModal from "./StudentPickerModal";

const ExamEditModal = ({
  open,
  onOpenChange,
  exam,
  accessToken,
  onExamUpdated,
}) => {
  const [examDetail, setExamDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Form state
  const [examDate, setExamDate] = useState("");
  const [roomId, setRoomId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [duration, setDuration] = useState("");

  // Available options
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [roomSearchTerm, setRoomSearchTerm] = useState("");

  // Students and supervisors management
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Modal states
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [isProctorPickerOpen, setIsProctorPickerOpen] = useState(false);

  useEffect(() => {
    if (open && exam && accessToken) {
      fetchExamDetail({ accessToken, exam });
      fetchRooms({ accessToken });
      fetchSlots({ accessToken });
    }
  }, [open, exam, accessToken]);

  useEffect(() => {
    if (examDetail) {
      setExamDate(examDetail.exam_date?.split("T")[0] || "");
      setRoomId(examDetail.room?.id?.toString() || "");
      setSlotId(examDetail.slot?.id?.toString() || "");
      setDuration(examDetail.duration?.toString() || "");
      setStudents(examDetail.students || []);
      setSupervisors(examDetail.supervisors || []);
    }
  }, [examDetail]);

  const fetchExamDetail = async ({ accessToken, exam }) => {
    try {
      setLoading(true);
      const response = await apiGetDetailExamById({
        accessToken,
        id: exam.id,
      });
      if (response.code === 200) {
        setExamDetail(response.data);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải chi tiết lịch thi");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async ({ accessToken }) => {
    try {
      const response = await apiGetRooms({
        accessToken,
        params: { page: 1, limit: 1000 },
      });
      if (response.code === 200) {
        setRooms(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchSlots = async ({ accessToken }) => {
    try {
      const response = await apiGetExamSlots({
        accessToken,
        params: { page: 1, limit: 100 },
      });
      if (response.code === 200) {
        setSlots(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  // Filter rooms by search term
  const filteredRooms = useMemo(() => {
    if (!roomSearchTerm) return rooms;
    const searchLower = roomSearchTerm.toLowerCase();
    return rooms.filter(
      (room) =>
        room.code?.toLowerCase().includes(searchLower) ||
        room.location?.name?.toLowerCase().includes(searchLower)
    );
  }, [rooms, roomSearchTerm]);

  const handleStudentPickerConfirm = (selectedStudents) => {
    if (selectedStudents[0]?.selectAll) {
      // Handle select all mode - you might want to fetch all students
      showToastSuccess("Đã chọn tất cả sinh viên");
      // For now, just close modal - in production you'd fetch all students
      setIsStudentPickerOpen(false);
    } else {
      setStudents(selectedStudents);
      showToastSuccess(`Đã chọn ${selectedStudents.length} sinh viên`);
      setIsStudentPickerOpen(false);
    }
  };

  const handleProctorPickerConfirm = (selectedProctors) => {
    if (selectedProctors[0]?.selectAll) {
      showToastSuccess("Đã chọn tất cả giám thị");
      setIsProctorPickerOpen(false);
    } else {
      const proctorsData = selectedProctors.map((p) => ({
        id: p.proctorId,
        code: p.proctorCode,
        full_name: p.proctorName,
        role: "Supervisor",
      }));
      setSupervisors(proctorsData);
      showToastSuccess(`Đã chọn ${proctorsData.length} giám thị`);
      setIsProctorPickerOpen(false);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setStudents(students.filter((s) => s.id !== studentId));
    showToastSuccess("Đã xóa sinh viên");
  };

  const handleRemoveSupervisor = (supervisorId) => {
    setSupervisors(supervisors.filter((s) => s.id !== supervisorId));
    showToastSuccess("Đã xóa giám thị");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updateData = {
        examDate: examDate ? new Date(examDate).toISOString() : undefined,
        roomId: roomId ? parseInt(roomId) : undefined,
        slotId: slotId ? parseInt(slotId) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        studentIds: students.map((s) => s.id),
        supervisorIds: supervisors.map((s) => ({
          lecturerId: s.id,
          role: s.role || "Supervisor",
        })),
      };

      const response = await apiUpdateExam({
        accessToken,
        id: exam.examId,
        data: updateData,
      });

      if (response.code === 200) {
        showToastSuccess("Cập nhật lịch thi thành công");
        onExamUpdated?.();
        onOpenChange(false);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi cập nhật lịch thi");
    } finally {
      setSaving(false);
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-blue-600" />
            Chỉnh sửa lịch thi - {exam.courseName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {console.log("examdate", examDate)}
                  <Label htmlFor="examDate" className="text-sm font-medium">
                    Ngày thi
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Thời lượng (phút)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1"
                    placeholder="120"
                  />
                </div>

                <div>
                  <Label htmlFor="room" className="text-sm font-medium">
                    Phòng thi
                  </Label>
                  <Select value={roomId} onValueChange={setRoomId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn phòng thi" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="sticky top-0 bg-white p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Tìm phòng..."
                            value={roomSearchTerm}
                            onChange={(e) => setRoomSearchTerm(e.target.value)}
                            className="pl-8 h-8"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredRooms.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Không tìm thấy phòng phù hợp
                          </div>
                        ) : (
                          filteredRooms.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id.toString()}
                            >
                              {room.code} - {room.location?.name} (SL:{" "}
                              {room.capacity})
                            </SelectItem>
                          ))
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="slot" className="text-sm font-medium">
                    Ca thi
                  </Label>
                  <Select value={slotId} onValueChange={setSlotId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn ca thi" />
                    </SelectTrigger>
                    <SelectContent>
                      {slots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id.toString()}>
                          {slot.slotName} ({slot.startTime} - {slot.endTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Students and Supervisors Management */}
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="students" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Sinh viên ({students.length})
                </TabsTrigger>
                <TabsTrigger value="supervisors" className="gap-2">
                  <UserCheck className="h-4 w-4" />
                  Giám thị ({supervisors.length})
                </TabsTrigger>
              </TabsList>

              {/* Students Tab */}
              <TabsContent value="students" className="mt-4 space-y-4">
                {/* Add Students Button */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Quản lý sinh viên
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Đã chọn {students.length} sinh viên
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsStudentPickerOpen(true)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Chọn sinh viên
                    </Button>
                  </div>
                </div>

                {/* Students List */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">STT</TableHead>
                        <TableHead>Mã SV</TableHead>
                        <TableHead>Họ và tên</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead className="w-24">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            Chưa có sinh viên nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student, index) => (
                          <TableRow key={student.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono">
                              {student.studentCode || student.code}
                            </TableCell>
                            <TableCell>
                              {student.fullName || student.full_name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {student.className ||
                                  student.class?.name ||
                                  "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveStudent(student.id)}
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Supervisors Tab */}
              <TabsContent value="supervisors" className="mt-4 space-y-4">
                {/* Add Supervisors Button */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Quản lý giám thị
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Đã chọn {supervisors.length} giám thị
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsProctorPickerOpen(true)}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Chọn giám thị
                    </Button>
                  </div>
                </div>

                {/* Supervisors List */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">STT</TableHead>
                        <TableHead>Mã GV</TableHead>
                        <TableHead>Họ và tên</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead className="w-24">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supervisors.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            Chưa có giám thị nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        supervisors.map((supervisor, index) => (
                          <TableRow key={supervisor.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono">
                              {supervisor.lecturerCode || supervisor.code}
                            </TableCell>
                            <TableCell>
                              {supervisor.fullName || supervisor.full_name}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">
                                {supervisor.role || "Supervisor"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleRemoveSupervisor(supervisor.id)
                                }
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Student Picker Modal */}
        <StudentPickerModal
          open={isStudentPickerOpen}
          onOpenChange={setIsStudentPickerOpen}
          onConfirm={handleStudentPickerConfirm}
          selectedStudents={students}
        />

        {/* Proctor Picker Modal */}
        <ProctorPickerModal
          open={isProctorPickerOpen}
          onOpenChange={setIsProctorPickerOpen}
          onConfirm={handleProctorPickerConfirm}
          selectedProctors={supervisors.map((s) => ({
            proctorId: s.id,
            proctorCode: s.code || s.lecturerCode,
            proctorName: s.full_name || s.fullName,
          }))}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExamEditModal;
