import { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users2,
  BookOpen,
  FileText,
  Info,
  Mail,
  UserCheck,
  GraduationCap,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { apiGetDetailExamById } from "~/apis/examsApi";
import { showToastError } from "~/utils/alert";
import { formatDate } from "~/utils/date";

const ExamDetailModal = ({
  open,
  onOpenChange,
  examId,
  accessToken,
  exam: oldExam,
}) => {
  const [examDetail, setExamDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("ExamDetailModal props:", {
    open,
    examId,
    accessToken: !!accessToken,
  });

  const fetchExamDetail = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching exam detail for ID:", examId);
      const response = await apiGetDetailExamById({ accessToken, id: examId });
      console.log("Exam detail response:", response);
      if (response.code === 200) {
        setExamDetail(response.data);
      }
    } catch (error) {
      console.error("Error fetching exam detail:", error);
      showToastError(error.message || "Lỗi khi tải chi tiết kỳ thi");
    } finally {
      setLoading(false);
    }
  }, [examId, accessToken]);

  useEffect(() => {
    console.log("ExamDetailModal useEffect:", {
      open,
      examId,
      accessToken: !!accessToken,
    });
    if (open && examId && accessToken) {
      fetchExamDetail();
    } else if (open && oldExam) {
      // Fallback to old exam data if examId not provided
      setExamDetail(null);
    }
  }, [open, examId, accessToken, oldExam, fetchExamDetail]);

  // Use examDetail if available, otherwise fallback to oldExam
  const exam = examDetail || oldExam;

  if (!exam) return null;

  const InfoRow = ({ icon: Icon, label, value, iconColor }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-base text-gray-900 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      Draft: { color: "bg-gray-100 text-gray-700", label: "Nháp" },
      Published: { color: "bg-green-100 text-green-700", label: "Đã công bố" },
      Completed: { color: "bg-blue-100 text-blue-700", label: "Đã hoàn thành" },
      Cancelled: { color: "bg-red-100 text-red-700", label: "Đã hủy" },
      oke: { color: "bg-green-100 text-green-700", label: "OK" },
      failed: { color: "bg-red-100 text-red-700", label: "Failed" },
    };
    const config = statusMap[status] || statusMap.Draft;
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const handleExportStudents = () => {
    // TODO: Implement export functionality
    showToastError("Chức năng xuất danh sách đang được phát triển");
  };

  const handleExportSupervisors = () => {
    // TODO: Implement export functionality
    showToastError("Chức năng xuất danh sách đang được phát triển");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-6 w-6 text-blue-600" />
            Chi tiết lịch thi
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải chi tiết...</p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thông tin ca thi */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Thông tin ca thi
                </h3>
                <div className="space-y-2">
                  <InfoRow
                    icon={Calendar}
                    label="Ngày thi"
                    value={formatDate(exam.examDate || exam.exam_date)}
                    iconColor="bg-blue-600"
                  />
                  <InfoRow
                    icon={Clock}
                    label="Ca thi"
                    value={
                      exam.examSlotName ||
                      (exam.slot
                        ? `${exam.slot.slot_name} (${exam.slot.start_time} - ${exam.slot.end_time})`
                        : "N/A")
                    }
                    iconColor="bg-purple-600"
                  />
                  <InfoRow
                    icon={Clock}
                    label="Thời lượng"
                    value={exam.duration ? `${exam.duration} phút` : "N/A"}
                    iconColor="bg-indigo-600"
                  />
                  <div className="flex items-start gap-3 py-3">
                    <div className="p-2 rounded-lg bg-teal-600">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Trạng thái
                      </p>
                      <div>{getStatusBadge(exam.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin môn học */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Thông tin môn học
                </h3>
                <div className="space-y-2">
                  <InfoRow
                    icon={BookOpen}
                    label="Học phần"
                    value={
                      exam.courseName || exam.exam_group?.course?.name || "N/A"
                    }
                    iconColor="bg-blue-600"
                  />
                  <InfoRow
                    icon={FileText}
                    label="Mã học phần"
                    value={
                      exam.courseCode || exam.exam_group?.course?.code || "N/A"
                    }
                    iconColor="bg-indigo-600"
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Phòng thi"
                    value={exam.roomName || exam.room?.code || "N/A"}
                    iconColor="bg-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Tabs for Students and Supervisors */}
            {examDetail && (examDetail.students || examDetail.supervisors) && (
              <Tabs defaultValue="students" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="students" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Sinh viên ({examDetail.students?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="supervisors" className="gap-2">
                    <UserCheck className="h-4 w-4" />
                    Giám thị ({examDetail.supervisors?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students" className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Danh sách sinh viên
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportStudents}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Xuất danh sách
                      </Button>
                    </div>

                    {examDetail.students && examDetail.students.length > 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {console.log("__", examDetail)}
                              <TableHead className="w-16">STT</TableHead>
                              <TableHead>Mã SV</TableHead>
                              <TableHead>Họ và tên</TableHead>
                              <TableHead>Lớp</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {examDetail.students.map((student, index) => (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {student.studentCode}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {student.fullName}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {student.className || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    {student.email || "N/A"}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Chưa có sinh viên đăng ký</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Supervisors Tab */}
                <TabsContent value="supervisors" className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-green-600" />
                        Danh sách giám thị
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportSupervisors}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Xuất danh sách
                      </Button>
                    </div>

                    {examDetail.supervisors &&
                    examDetail.supervisors.length > 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">STT</TableHead>
                              <TableHead>Mã GV</TableHead>
                              <TableHead>Họ và tên</TableHead>
                              <TableHead>Vai trò</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {examDetail.supervisors.map((supervisor, index) => (
                              <TableRow key={supervisor.id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {supervisor.lecturerCode}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {supervisor.fullName}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      supervisor.role === "Supervisor"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }
                                  >
                                    {supervisor.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    {supervisor.email || "N/A"}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <UserCheck className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Chưa có giám thị được phân công</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExamDetailModal;
