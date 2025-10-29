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
import { Search, Building2, CheckCircle2 } from "lucide-react";
import { apiGetDepartments } from "~/apis/departmentsApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import Pagination from "~/components/pagination/Pagination";

export default function DepartmentPickerModal({
  open,
  onOpenChange,
  onSelect,
}) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const { accessToken } = useSelector((state) => state.user);

  // Fetch departments with search and pagination
  const fetchDepartments = async (page = 1, name = "") => {
    try {
      setLoading(true);
      const response = await apiGetDepartments({
        accessToken,
        params: {
          page,
          limit: 10,
          name: name.trim() || undefined,
        },
      });

      if (response.code === 200) {
        setDepartments(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách khoa");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách khoa");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchDepartments(1, "");
      setSearchTerm("");
      setSelectedDepartment(null);
    }
  }, [open, accessToken]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchDepartments(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchDepartments(page, searchTerm);
  };

  const handleSelectDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleConfirm = () => {
    if (selectedDepartment) {
      onSelect(selectedDepartment);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-indigo-600" />
            Chọn Khoa
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn khoa cho giảng viên
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên khoa..."
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
                <TableHead className="font-semibold">Mã khoa</TableHead>
                <TableHead className="font-semibold">Tên khoa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-indigo-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy khoa phù hợp"
                          : "Chưa có khoa nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow
                    key={department.id}
                    className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                      selectedDepartment?.id === department.id
                        ? "bg-indigo-100"
                        : ""
                    }`}
                    onClick={() => handleSelectDepartment(department)}
                  >
                    <TableCell className="text-center">
                      {selectedDepartment?.id === department.id && (
                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{department.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        {department.code || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {department.name}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && departments.length > 0 && (
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
            {selectedDepartment ? (
              <span>
                Đã chọn: <strong>{selectedDepartment.name}</strong> (ID:{" "}
                {selectedDepartment.id})
              </span>
            ) : (
              <span>Chưa chọn khoa nào</span>
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
              disabled={!selectedDepartment}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
