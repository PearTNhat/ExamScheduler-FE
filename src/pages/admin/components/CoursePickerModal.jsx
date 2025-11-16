import { useState, useEffect } from "react";
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
import { Search, BookOpen, CheckCircle2 } from "lucide-react";
import { apiGetCourses } from "~/apis/courseApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import Pagination from "~/components/pagination/Pagination";

export default function CoursePickerModal({ open, onOpenChange, onSelect }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const { accessToken } = useSelector((state) => state.user);

  // Fetch courses with search and pagination
  const fetchCourses = async (page = 1, name = "") => {
    try {
      setLoading(true);
      const response = await apiGetCourses({
        accessToken,
        params: {
          page,
          limit: 10,
          name: name.trim() || undefined,
        },
      });

      if (response.code === 200) {
        setCourses(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách học phần");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách học phần");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchCourses(1, "");
      setSearchTerm("");
      setSelectedCourse(null);
    }
  }, [open, accessToken]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchCourses(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchCourses(page, searchTerm);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleConfirm = () => {
    if (selectedCourse) {
      onSelect(selectedCourse);
    }
  };
  console.log("courses", courses);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Chọn Học phần
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn học phần cho nhóm thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên học phần..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Mã học phần</TableHead>
                <TableHead className="font-semibold">Tên học phần</TableHead>
                <TableHead className="font-semibold">Số tín chỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy học phần phù hợp"
                          : "Chưa có học phần nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                      selectedCourse?.id === course.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleSelectCourse(course)}
                  >
                    <TableCell className="text-center">
                      {selectedCourse?.id === course.id && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{course.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-mono">{course.codeCourse}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {course.nameCourse}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {course.credits || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && courses.length > 0 && (
          <div className="border-t pt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedCourse ? (
              <span>
                Đã chọn: <strong>{selectedCourse.name}</strong> (ID:{" "}
                {selectedCourse.id})
              </span>
            ) : (
              <span>Chưa chọn học phần nào</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedCourse}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
