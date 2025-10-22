import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Clock, Calendar } from "lucide-react";
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
  apiGetExamSlots,
  apiCreateExamSlot,
  apiUpdateExamSlot,
  apiDeleteExamSlot,
} from "~/apis/exam-slotApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import ExamSlotFormModal from "./components/ExamSlotFormModal";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const ExamSlotsManager = () => {
  const [examSlots, setExamSlots] = useState([]);
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
  const [editingSlot, setEditingSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exam slots
  const fetchExamSlots = useCallback(
    async ({ accessToken }) => {
      try {
        setLoading(true);
        const params = {
          page: currentParams.page || 1,
          limit: 10,
          // name: currentParams.name || searchTerm,
        };
        const response = await apiGetExamSlots({ accessToken, params });
        if (response.code === 200) {
          setExamSlots(response.data.data || []);
          setPagination({
            currentPage: response.data.meta.page,
            totalPages: response.data.meta.totalPages,
          });
        } else {
          showToastError(response.message || "Lỗi khi tải danh sách ca thi");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi tải danh sách ca thi");
      } finally {
        setLoading(false);
      }
    },
    [accessToken, currentParams, searchTerm]
  );

  useEffect(() => {
    if (accessToken) {
      fetchExamSlots({ accessToken });
    }
  }, [accessToken, currentParams]);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("name", searchTerm);
      params.set("page", "1");
    } else {
      params.delete("name");
    }
    setSearchParams(params);
  };

  // Handle Enter key in search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination handler
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingSlot) {
        response = await apiUpdateExamSlot({
          id: editingSlot.id,
          body: data,
          accessToken,
        });
      } else {
        response = await apiCreateExamSlot({ body: data, accessToken });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingSlot
            ? "Cập nhật ca thi thành công!"
            : "Thêm ca thi mới thành công!"
        );
        setIsModalOpen(false);
        setEditingSlot(null);
        fetchExamSlots({ accessToken });
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
  const handleDeleteSlot = async (slot) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc muốn xóa ca thi "${slot.slot_name}"?`
    );
    if (confirmed) {
      try {
        const response = await apiDeleteExamSlot({
          id: slot.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa ca thi thành công!");
          fetchExamSlots({ accessToken });
        } else {
          showToastError(response.message || "Lỗi khi xóa ca thi");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa ca thi");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Ca thi</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các ca thi trong đợt thi
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên ca thi..."
              className="pl-10 h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              variant="outline"
              className="h-11 px-6"
            >
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="gap-2 h-11 px-6 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Thêm ca thi
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-teal-50 to-teal-100/50 hover:from-teal-50 hover:to-teal-100/50">
              <TableHead className="font-semibold text-teal-900">
                Tên ca thi
              </TableHead>
              <TableHead className="font-semibold text-teal-900">
                Đợt thi
              </TableHead>
              <TableHead className="font-semibold text-teal-900">
                Giờ bắt đầu
              </TableHead>
              <TableHead className="font-semibold text-teal-900">
                Giờ kết thúc
              </TableHead>
              <TableHead className="font-semibold text-teal-900">
                Mô tả
              </TableHead>
              <TableHead className="text-right font-semibold text-teal-900">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-teal-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : examSlots.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy ca thi phù hợp"
                        : "Chưa có ca thi nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm ca thi" để tạo ca thi mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              examSlots.map((slot) => (
                <TableRow
                  key={slot.id}
                  className="hover:bg-teal-50/30 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {slot.slotName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">
                        {slot.examSession?.description || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {slot.startTime || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {slot.endTime || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="max-w-xs truncate">
                      {slot.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(slot)}
                        className="h-8 w-8 text-teal-600 hover:bg-teal-50"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSlot(slot)}
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

        {/* Pagination */}
        {!loading && examSlots.length > 0 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ExamSlotFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingSlot(null);
          }
        }}
        editingSlot={editingSlot}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ExamSlotsManager;
