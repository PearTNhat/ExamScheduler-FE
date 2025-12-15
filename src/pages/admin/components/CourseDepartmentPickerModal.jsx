import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BookOpen, Search, Building2, Calendar, Users } from "lucide-react";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { apiGetCoursesByExamSession } from "~/apis/student-course-registrationsApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function CourseDepartmentPickerModal({
  open,
  onOpenChange,
  onSelect,
}) {
  const { accessToken } = useSelector((state) => state.user);
  const [courseDepartments, setCourseDepartments] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExamSession, setSelectedExamSession] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch exam sessions
  const fetchExamSessions = async () => {
    try {
      const response = await apiGetExamSessions({ accessToken });
      if (response.code === 200) {
        setExamSessions(response.data || []);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách kỳ thi");
    }
  };

  // Fetch course departments via "courses by exam session" API
  const fetchCourseDepartments = async (
    page = 1,
    search = "",
    examSessionId = ""
  ) => {
    try {
      setLoading(true);
      if (!examSessionId || examSessionId === "all") {
        setCourseDepartments([]);
        setPagination({ currentPage: 1, totalPages: 1 });
        return;
      }

      const params = { page, limit: 10 };
      if (search) params.search = search;

      const response = await apiGetCoursesByExamSession(
        accessToken,
        parseInt(examSessionId),
        params
      );

      if (response.code === 200) {
        setCourseDepartments(response.data?.data || []);
        setPagination({
          currentPage: response.data?.meta?.page || page,
          totalPages: response.data?.meta?.totalPages || 1,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách môn học");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (open && accessToken) {
      (async () => {
        await fetchExamSessions();
        setSearchTerm("");
        // Default select first session (if available) and fetch
        setTimeout(() => {
          // ensure state updated after fetchExamSessions resolves
          // we cannot rely on immediate state, so compute directly
        }, 0);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accessToken]);

  // When examSessions loaded, default to first session if none selected
  useEffect(() => {
    if (!open) return;
    if (!selectedExamSession && examSessions.length > 0) {
      const first = examSessions[0];
      const idStr = first.id.toString();
      setSelectedExamSession(idStr);
      fetchCourseDepartments(1, "", idStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examSessions, open]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchCourseDepartments(1, searchTerm, selectedExamSession);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Handle exam session change
  const handleExamSessionChange = (sessionId) => {
    setSelectedExamSession(sessionId);
    fetchCourseDepartments(1, searchTerm, sessionId);
  };

  const handlePageChange = (page) => {
    fetchCourseDepartments(page, searchTerm, selectedExamSession);
  };

  const handleSelect = (item) => {
    // Normalize selected item to a CourseDepartment-like shape expected by callers
    const pickedSession = examSessions.find(
      (s) => s.id.toString() === selectedExamSession
    );

    const normalized = {
      id: item.courseDepartmentId || item.id,
      course: {
        codeCourse: item.codeCourse || item.course?.codeCourse,
        nameCourse: item.nameCourse || item.course?.nameCourse,
        credits: item.credits || item.course?.credits,
      },
      classes: item.className ? { name: item.className } : item.classes,
      lecturer: item.lecturerName ? { name: item.lecturerName } : item.lecturer,
      department: item.departmentName
        ? { departmentName: item.departmentName }
        : item.department,
      examSession: {
        id: pickedSession?.id || item.examSession?.id,
        name: pickedSession?.name || item.examSession?.name,
      },
    };

    onSelect(normalized);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Chọn Đăng Ký Học Phần
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn môn học đã được đăng ký trong kỳ thi
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3">
          {/* Exam Session Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
              Kỳ thi:
            </label>
            <Select
              value={selectedExamSession}
              onValueChange={handleExamSessionChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                {examSessions.map((session) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {session.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã môn học..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="font-semibold">Mã môn học</TableHead>
                <TableHead className="font-semibold">Tên môn học</TableHead>
                <TableHead className="font-semibold">Khoa</TableHead>
                <TableHead className="font-semibold">Lớp</TableHead>
                <TableHead className="font-semibold">Giảng viên</TableHead>
                <TableHead className="font-semibold">Kỳ thi</TableHead>
                <TableHead className="font-semibold">Tín chỉ</TableHead>
                <TableHead className="font-semibold">Bắt buộc</TableHead>
                <TableHead className="text-right font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : courseDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm || selectedExamSession
                          ? "Không tìm thấy môn học phù hợp"
                          : "Hãy chọn kỳ thi và tìm kiếm môn học"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courseDepartments.map((cd) => (
                  <TableRow
                    key={cd.id || cd.courseDepartmentId}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleSelect(cd)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        {cd.codeCourse || cd.course?.codeCourse || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {cd.nameCourse || cd.course?.nameCourse || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-500" />
                        <Badge variant="outline">
                          {cd.departmentName ||
                            cd.department?.departmentName ||
                            "N/A"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cd.className || cd.classes?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          {cd.lecturerName || cd.lecturer?.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">
                          {examSessions.find(
                            (s) => s.id.toString() === selectedExamSession
                          )?.name ||
                            cd.examSession?.name ||
                            "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {cd.credits || cd.course?.credits || 0} TC
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cd.isCompulsory ?? cd.is_compulsory ?? false ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          Bắt buộc
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                          Tự chọn
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(cd);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Chọn
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading &&
          courseDepartments.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="border-t pt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPageCount={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
