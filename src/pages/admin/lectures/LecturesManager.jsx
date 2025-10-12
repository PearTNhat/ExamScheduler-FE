import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UserCheck,
  Users,
  GraduationCap,
  Mail,
  Building2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  apiGetLecturers,
  apiCreateLecturer,
  apiUpdateLecturer,
  apiDeleteLecturer,
} from "~/apis/lecturesApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import LecturerFormModal from "./components/LecturerFormModal";

const LecturesManager = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch lecturers

  const fetchLecturers = useCallback(async ({ accessToken }) => {
    try {
      setLoading(true);
      const response = await apiGetLecturers({ accessToken });
      if (response.success) {
        setLecturers(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách giảng viên");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLecturers({ accessToken });
  }, [accessToken]);

  // Filter lecturers
  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${lecturer.user?.firstName || ""} ${
      lecturer.user?.lastName || ""
    }`.trim();
    return (
      lecturer.code?.toLowerCase().includes(searchLower) ||
      fullName.toLowerCase().includes(searchLower) ||
      lecturer.user?.email?.toLowerCase().includes(searchLower) ||
      lecturer.department?.departmentName?.toLowerCase().includes(searchLower)
    );
  });

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingLecturer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lecturer) => {
    setEditingLecturer(lecturer);
    setIsModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingLecturer) {
        response = await apiUpdateLecturer({
          id: editingLecturer.id,
          body: data,
          accessToken,
        });
      } else {
        response = await apiCreateLecturer({ body: data, accessToken });
      }

      if (response.success) {
        showToastSuccess(
          editingLecturer
            ? "Cập nhật giảng viên thành công!"
            : "Thêm giảng viên mới thành công!"
        );
        setIsModalOpen(false);
        fetchLecturers();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteLecturer = async (lecturer) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc muốn xóa giảng viên "${lecturer.code}"?`
    );
    if (confirmed) {
      try {
        const response = await apiDeleteLecturer({
          id: lecturer.id,
          accessToken,
        });
        if (response.success) {
          showToastSuccess("Xóa giảng viên thành công");
          fetchLecturers();
        } else {
          showToastError(response.message || "Lỗi khi xóa giảng viên");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra khi xóa giảng viên");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý giảng viên
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý danh sách giảng viên và giám thị trong hệ thống
            </p>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email, khoa..."
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="gap-2 h-11 px-6 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Thêm giảng viên
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã GV</TableHead>
              <TableHead className="font-semibold">Họ tên</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Khoa/Viện</TableHead>
              <TableHead className="font-semibold">Vai trò</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && lecturers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLecturers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy giảng viên phù hợp"
                        : "Chưa có giảng viên nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm giảng viên" để tạo giảng viên mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLecturers.map((lecturer) => (
                <TableRow key={lecturer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{lecturer.code}</TableCell>
                  <TableCell>
                    {`${lecturer.user?.firstName || ""} ${
                      lecturer.user?.lastName || ""
                    }`.trim() || "N/A"}
                  </TableCell>
                  <TableCell>{lecturer.user?.email || "N/A"}</TableCell>
                  <TableCell>
                    {lecturer.department?.departmentName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {lecturer.isSupervisor ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-300 gap-1.5"
                      >
                        <UserCheck className="h-3 w-3" />
                        Giám thị
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Giảng viên</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(lecturer.createdAt || lecturer.createAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(lecturer)}
                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLecturer(lecturer)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <LecturerFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingLecturer={editingLecturer}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LecturesManager;
