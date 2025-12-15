import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UserCheck,
  GraduationCap,
  Upload,
  Eye,
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
import {
  apiGetLecturers,
  apiCreateLecturer,
  apiUpdateLecturer,
  apiDeleteLecturer,
  apiGetLecturerById,
} from "~/apis/lecturesApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import LecturerFormModal from "./components/LecturerFormModal";
import LecturerDetailModal from "./components/LecturerDetailModal";
import { LecturerUploadModal } from "./components/LecturerUploadModal";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const LecturesManager = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch lecturers

  const fetchLecturers = useCallback(
    async ({ accessToken, currentParams }) => {
      try {
        setLoading(true);
        const params = {
          page: currentParams.page,
          limit: 10,
          search: currentParams.code,
        };
        const response = await apiGetLecturers({ accessToken, params });
        if (response.code === 200) {
          setLecturers(response.data.data || []);
          setPagination({
            currentPage: response.data.meta.page,
            totalPages: response.data.meta.totalPages,
          });
        } else {
          showToastError(
            response.message || "Lỗi khi tải danh sách giảng viên"
          );
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi tải danh sách giảng viên");
      } finally {
        setLoading(false);
      }
    },
    [currentParams]
  );

  useEffect(() => {
    fetchLecturers({ accessToken, currentParams });
  }, [accessToken, currentParams]);

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingLecturer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (lecturer) => {
    try {
      setLoadingDetail(true);
      const response = await apiGetLecturerById({
        id: lecturer.id,
        accessToken,
      });

      if (response.code === 200) {
        const detail = response.data;
        setEditingLecturer(detail);
        setIsModalOpen(true);
      } else {
        showToastError(response.message || "Lỗi khi tải thông tin giảng viên");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải thông tin giảng viên");
    } finally {
      setLoadingDetail(false);
    }
  };

  // View detail handler
  const handleViewDetail = async (lecturer) => {
    try {
      setLoadingDetail(true);
      setIsDetailModalOpen(true);

      const response = await apiGetLecturerById({
        id: lecturer.id,
        accessToken,
      });

      if (response.code === 200) {
        setSelectedLecturer(response.data);
      } else {
        showToastError(response.message || "Lỗi khi tải thông tin giảng viên");
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải thông tin giảng viên");
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
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

      if (response.code == 200) {
        showToastSuccess(
          editingLecturer
            ? "Cập nhật giảng viên thành công!"
            : "Thêm giảng viên mới thành công!"
        );
        setIsModalOpen(false);
        fetchLecturers({ accessToken, currentParams });
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
        if (response.code === 200) {
          showToastSuccess("Xóa giảng viên thành công");
          fetchLecturers({ accessToken, currentParams });
        } else {
          showToastError(response.message || "Lỗi khi xóa giảng viên");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra khi xóa giảng viên");
      }
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("code", searchTerm.trim());
          prev.set("page", "1"); // Quay về trang 1 khi tìm kiếm
        } else {
          prev.delete("code");
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);
  const handlePageChange = (page) =>
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page }));
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
          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 h-11 px-6 bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-5 w-5" />
              Upload Excel
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="gap-2 h-11 px-6 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Thêm giảng viên
            </Button>
          </div>
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
            ) : lecturers.length === 0 ? (
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
              lecturers.map((lecturer) => (
                <TableRow key={lecturer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {lecturer.lecturerCode}
                  </TableCell>
                  <TableCell>
                    {`${lecturer?.firstName || ""} ${
                      lecturer?.lastName || ""
                    }`.trim() || "N/A"}
                  </TableCell>
                  <TableCell>{lecturer?.email || "N/A"}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(lecturer.createdAt || lecturer.createAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(lecturer)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(lecturer)}
                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLecturer(lecturer)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        title="Xóa"
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
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <LecturerFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingLecturer={editingLecturer}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <LecturerDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open);
          if (!open) {
            setSelectedLecturer(null);
          }
        }}
        lecturer={selectedLecturer}
        loading={loadingDetail}
      />

      <LecturerUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadSuccess={() => fetchLecturers({ accessToken, currentParams })}
      />
    </div>
  );
};

export default LecturesManager;
