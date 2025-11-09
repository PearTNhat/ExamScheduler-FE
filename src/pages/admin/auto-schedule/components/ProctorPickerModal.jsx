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
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Users } from "lucide-react";
import { apiGetLecturers } from "~/apis/lecturesApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function ProctorPickerModal({
  open,
  onOpenChange,
  onConfirm,
  selectedProctors,
}) {
  const { accessToken } = useSelector((state) => state.user);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedProctors, setTempSelectedProctors] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch lecturers with search and pagination
  const fetchLecturers = async (page = 1, fullName = "") => {
    try {
      setLoading(true);
      const response = await apiGetLecturers({
        accessToken,
        params: {
          page,
          limit: 10,
          fullName: fullName.trim() || undefined,
        },
      });
      if (response.data.data) {
        const lectures = response.data.data;
        setLecturers(lectures);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách giám thị");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách giám thị");
    } finally {
      setLoading(false);
    }
  };
  // Initialize when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchLecturers(1, "");
      setSearchTerm("");

      // Initialize with current selected proctors (no selectAll logic)
      setTempSelectedProctors([...selectedProctors]);
    }
  }, [open, accessToken, selectedProctors]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchLecturers(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, open]);

  const handlePageChange = (page) => {
    fetchLecturers(page, searchTerm);
  };

  // Check if all lecturers in current page are selected
  const areAllCurrentPageLecturersSelected = () => {
    return lecturers.every((lecturer) =>
      tempSelectedProctors.some(
        (selected) => selected.proctorId === lecturer.id
      )
    );
  };

  // Select/deselect all lecturers in current page
  const handleSelectAllCurrentPage = (checked) => {
    if (checked) {
      // Add all current page lecturers to selection (if not already selected)
      const newProctors = lecturers
        .filter(
          (lecturer) =>
            !tempSelectedProctors.some(
              (selected) => selected.proctorId === lecturer.id
            )
        )
        .map((lecturer) => ({
          proctorId: lecturer.id,
          lecturerCode: lecturer.lecturerCode,
          name: `${lecturer.firstName} ${lecturer.lastName}`,
        }));

      setTempSelectedProctors([...tempSelectedProctors, ...newProctors]);
    } else {
      // Remove all current page lecturers from selection
      const currentPageLecturerIds = lecturers.map((lecturer) => lecturer.id);
      setTempSelectedProctors(
        tempSelectedProctors.filter(
          (selected) => !currentPageLecturerIds.includes(selected.proctorId)
        )
      );
    }
  };

  const handleToggleLecturer = (lecturer) => {
    const isSelected = tempSelectedProctors.some(
      (p) => p.proctorId === lecturer.id
    );

    if (isSelected) {
      setTempSelectedProctors(
        tempSelectedProctors.filter((p) => p.proctorId !== lecturer.id)
      );
    } else {
      setTempSelectedProctors([
        ...tempSelectedProctors,
        {
          proctorId: lecturer.id,
          lecturerCode: lecturer.lecturerCode,
          name: `${lecturer.firstName} ${lecturer.lastName}`,
        },
      ]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedProctors);
  };

  const isLecturerSelected = (lecturerId) => {
    return tempSelectedProctors.some((p) => p.proctorId === lecturerId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-green-600" />
            Chọn Giám Thị
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn giảng viên giám thị cho kỳ thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã giảng viên..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Select All Current Page Checkbox */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <Checkbox
            id="select-all-current-page-proctors"
            checked={areAllCurrentPageLecturersSelected()}
            onCheckedChange={handleSelectAllCurrentPage}
          />
          <label
            htmlFor="select-all-current-page-proctors"
            className="text-sm font-medium cursor-pointer"
          >
            Chọn tất cả trang hiện tại ({lecturers.length} giám thị) - Đã chọn:{" "}
            {tempSelectedProctors.length} giám thị
          </label>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Mã GV</TableHead>
                <TableHead className="font-semibold">Họ tên</TableHead>
                <TableHead className="font-semibold">Khoa</TableHead>
                <TableHead className="font-semibold">Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : lecturers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy giám thị phù hợp"
                          : "Chưa có giám thị nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                lecturers.map((lecturer) => {
                  const isSelected = isLecturerSelected(lecturer.id);
                  const fullName = `${lecturer.firstName} ${lecturer.lastName}`;

                  return (
                    <TableRow
                      key={lecturer.id}
                      className={`cursor-pointer hover:bg-green-50 transition-colors ${
                        isSelected ? "bg-green-100" : ""
                      }`}
                      onClick={() => handleToggleLecturer(lecturer)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleLecturer(lecturer)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 rounded">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          {lecturer.lecturerCode}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{fullName}</TableCell>
                      <TableCell>
                        {lecturer.department ? (
                          <Badge variant="outline">
                            {lecturer.department.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Giám thị
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && lecturers.length > 0 && pagination.totalPages > 1 && (
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
            {tempSelectedProctors.length > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ Đã chọn: <strong>{tempSelectedProctors.length}</strong> giám
                thị
              </span>
            ) : (
              <span>Chưa chọn giám thị nào</span>
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
              className="bg-green-600 hover:bg-green-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
