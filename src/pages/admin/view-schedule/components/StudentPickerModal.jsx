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
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { GraduationCap, Search } from "lucide-react";
import { apiGetStudents } from "~/apis/studentsApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function StudentPickerModal({
  open,
  onOpenChange,
  onConfirm,
  selectedStudents,
  multiSelect = true,
}) {
  const { accessToken } = useSelector((state) => state.user);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedStudents, setTempSelectedStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch students with search and pagination
  const fetchStudents = async (page = 1, fullName = "") => {
    try {
      setLoading(true);
      const response = await apiGetStudents({
        accessToken,
        params: {
          page,
          limit: 20,
          search: fullName.trim() || undefined,
        },
      });
      if (response.code === 200) {
        setStudents(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách sinh viên");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchStudents(1, "");
      setSearchTerm("");
      setTempSelectedStudents([...selectedStudents]);
    }
  }, [open, accessToken, selectedStudents]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchStudents(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchStudents(page, searchTerm);
  };

  // Check if all students in current page are selected
  const areAllCurrentPageStudentsSelected = () => {
    return students.every((student) =>
      tempSelectedStudents.some((selected) => selected.id === student.id)
    );
  };

  // Select/deselect all students in current page
  const handleSelectAllCurrentPage = (checked) => {
    if (checked) {
      // Add all current page students to selection (if not already selected)
      const newStudents = students
        .filter(
          (student) =>
            !tempSelectedStudents.some((selected) => selected.id === student.id)
        )
        .map((student) => ({
          id: student.id,
          studentCode: student.studentCode,
          className: student.classes?.className,
          fullName: `${student.firstName} ${student.lastName}`,
        }));

      setTempSelectedStudents([...tempSelectedStudents, ...newStudents]);
    } else {
      // Remove all current page students from selection
      const currentPageStudentIds = students.map((student) => student.id);
      setTempSelectedStudents(
        tempSelectedStudents.filter(
          (selected) => !currentPageStudentIds.includes(selected.id)
        )
      );
    }
  };
  const handleToggleStudent = (student) => {
    const isSelected = tempSelectedStudents.some((s) => s.id === student.id);

    if (isSelected) {
      setTempSelectedStudents(
        tempSelectedStudents.filter((s) => s.id !== student.id)
      );
    } else {
      const newStudent = {
        id: student.id,
        studentCode: student.studentCode,
        className: student.classes?.className,
        fullName: `${student.firstName} ${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
      };

      if (multiSelect) {
        setTempSelectedStudents([...tempSelectedStudents, newStudent]);
      } else {
        setTempSelectedStudents([newStudent]);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedStudents);
  };

  const isStudentSelected = (studentId) => {
    return tempSelectedStudents.some((s) => s.id === studentId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Chọn Sinh Viên
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn sinh viên tham gia kỳ thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sinh viên..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Select All Current Page Checkbox */}
        {multiSelect && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Checkbox
              id="select-all-current-page-students"
              checked={areAllCurrentPageStudentsSelected()}
              onCheckedChange={handleSelectAllCurrentPage}
            />
            <label
              htmlFor="select-all-current-page-students"
              className="text-sm font-medium cursor-pointer"
            >
              Chọn tất cả trang hiện tại ({students.length} sinh viên) - Đã
              chọn: {tempSelectedStudents.length} sinh viên
            </label>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Mã SV</TableHead>
                <TableHead className="font-semibold">Họ tên</TableHead>
                <TableHead className="font-semibold">Lớp</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
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
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <GraduationCap className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy sinh viên phù hợp"
                          : "Chưa có sinh viên nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => {
                  const isSelected = isStudentSelected(student.id);
                  const fullName = `${student.firstName} ${student.lastName}`;

                  return (
                    <TableRow
                      key={student.id}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                        isSelected ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleToggleStudent(student)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleStudent(student)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                          </div>
                          {student.studentCode}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{fullName}</TableCell>
                      <TableCell>
                        {student.classes ? (
                          <Badge variant="outline">
                            {student.classes.className}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {student.email || "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && pagination.totalPages > 1 && (
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
            {tempSelectedStudents.length > 0 ? (
              <span className="text-blue-600 font-medium">
                ✓ Đã chọn: <strong>{tempSelectedStudents.length}</strong> sinh
                viên{multiSelect ? "" : " (Chế độ chọn 1)"}
              </span>
            ) : (
              <span>Chưa chọn sinh viên nào</span>
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
