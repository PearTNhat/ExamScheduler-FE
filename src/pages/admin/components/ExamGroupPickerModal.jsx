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
import { Users2, Search, BookOpen, Calendar, Building2 } from "lucide-react";
import { apiGetExamGroups } from "~/apis/exam-groupsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function ExamGroupPickerModal({ open, onOpenChange, onSelect }) {
  const { accessToken } = useSelector((state) => state.user);
  const [examGroups, setExamGroups] = useState([]);
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

  // Fetch exam groups
  const fetchExamGroups = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      if (selectedExamSession) {
        params.examSessionId = parseInt(selectedExamSession);
      }

      const response = await apiGetExamGroups({
        accessToken,
        params,
      });

      if (response.code === 200) {
        setExamGroups(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách nhóm thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách nhóm thi");
    } finally {
      setLoading(false);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchExamSessions();
      fetchExamGroups(1);
      setSearchTerm("");
      setSelectedExamSession("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accessToken]);

  // Handle exam session change
  const handleExamSessionChange = (sessionId) => {
    setSelectedExamSession(sessionId);
    fetchExamGroups(1);
  };

  const handlePageChange = (page) => {
    fetchExamGroups(page);
  };

  const handleSelect = (examGroup) => {
    onSelect(examGroup);
    onOpenChange(false);
  };

  // Filter exam groups by search term (client-side)
  const filteredExamGroups = examGroups.filter((eg) => {
    if (!searchTerm) return true;
    const courseCode = eg.courseDepartment?.course?.codeCourse || "";
    const courseName = eg.courseDepartment?.course?.nameCourse || "";
    const search = searchTerm.toLowerCase();
    return (
      courseCode.toLowerCase().includes(search) ||
      courseName.toLowerCase().includes(search)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users2 className="h-6 w-6 text-amber-600" />
            Chọn Nhóm Thi
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn nhóm thi để tạo lịch thi
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
                <SelectValue placeholder="Tất cả kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỳ thi</SelectItem>
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
              placeholder="Tìm kiếm theo mã hoặc tên môn học..."
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
                <TableHead className="font-semibold">Môn học</TableHead>
                <TableHead className="font-semibold">Khoa</TableHead>
                <TableHead className="font-semibold">Kỳ thi</TableHead>
                <TableHead className="font-semibold">SL dự kiến</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="text-right font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-amber-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredExamGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users2 className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm || selectedExamSession
                          ? "Không tìm thấy nhóm thi phù hợp"
                          : "Chưa có nhóm thi nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExamGroups.map((eg) => (
                  <TableRow
                    key={eg.id}
                    className="cursor-pointer hover:bg-amber-50 transition-colors"
                    onClick={() => handleSelect(eg)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {eg.courseDepartment?.course?.nameCourse || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {eg.courseDepartment?.course?.codeCourse || ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-500" />
                        <Badge variant="outline">
                          {eg.courseDepartment?.department?.departmentName ||
                            "N/A"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">
                          {eg.examSession?.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">
                          {eg.expected_student_count || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {eg.status === "not_scheduled" && (
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                          Chưa lên lịch
                        </Badge>
                      )}
                      {eg.status === "scheduled" && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Đã lên lịch
                        </Badge>
                      )}
                      {eg.status === "completed" && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Hoàn thành
                        </Badge>
                      )}
                      {eg.status === "cancelled" && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          Đã hủy
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(eg);
                        }}
                        className="bg-amber-600 hover:bg-amber-700"
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
          filteredExamGroups.length > 0 &&
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
