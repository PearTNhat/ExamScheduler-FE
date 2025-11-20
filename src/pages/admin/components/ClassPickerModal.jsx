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
import { Search, Users, CheckCircle2 } from "lucide-react";
import { apiGetClasses } from "~/apis/classesApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import Pagination from "~/components/pagination/Pagination";

export default function ClassPickerModal({ open, onOpenChange, onSelect }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const { accessToken } = useSelector((state) => state.user);

  // Fetch classes with search and pagination
  const fetchClasses = async (page = 1, name = "") => {
    try {
      setLoading(true);
      const response = await apiGetClasses({
        accessToken,
        params: {
          page,
          limit: 10,
          name: name.trim() || undefined,
        },
      });

      if (response.code === 200) {
        setClasses(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách lớp học");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách lớp học");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchClasses(1, "");
      setSearchTerm("");
      setSelectedClass(null);
    }
  }, [open, accessToken]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchClasses(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchClasses(page, searchTerm);
  };

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleConfirm = () => {
    if (selectedClass) {
      onSelect(selectedClass);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-indigo-600" />
            Chọn Lớp học
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn lớp học cho sinh viên
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên lớp..."
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
                <TableHead className="font-semibold">Mã lớp</TableHead>
                <TableHead className="font-semibold">Tên lớp</TableHead>
                <TableHead className="font-semibold">Khoa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-indigo-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy lớp học phù hợp"
                          : "Chưa có lớp học nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((classItem) => (
                  <TableRow
                    key={classItem.id}
                    className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                      selectedClass?.id === classItem.id ? "bg-indigo-100" : ""
                    }`}
                    onClick={() => handleSelectClass(classItem)}
                  >
                    <TableCell className="text-center">
                      {selectedClass?.id === classItem.id && (
                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{classItem.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded">
                          <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        {classItem.classCode}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {classItem.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {classItem.department?.name || "Chưa có khoa"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && classes.length > 0 && (
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
            {selectedClass ? (
              <span>
                Đã chọn: <strong>{selectedClass.name}</strong> (ID:{" "}
                {selectedClass.id})
              </span>
            ) : (
              <span>Chưa chọn lớp học nào</span>
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
              disabled={!selectedClass}
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
