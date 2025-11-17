import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Calendar, Search } from "lucide-react";
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
import AcademicYearFormModal from "./components/AcademicYearFormModal";
import {
  apiGetAcademicYears,
  apiCreateAcademicYear,
  apiUpdateAcademicYear,
  apiDeleteAcademicYear,
} from "~/apis/academic-yearsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const AcademicYearManager = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Fetch academic years
  useEffect(() => {
    fetchAcademicYears();
  }, [currentParams.page, currentParams.name]);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("name", searchTerm.trim());
          prev.set("page", "1");
        } else {
          prev.delete("name");
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);

  const handlePageChange = (page) =>
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page }));

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentParams.page || 1,
        limit: 10,
        name: currentParams.name,
      };
      const response = await apiGetAcademicYears({ accessToken, params });
      if (response.code === 200) {
        setYears(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách năm học");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách năm học");
    } finally {
      setLoading(false);
    }
  };

  // Use years directly from state (already filtered by backend)
  const filteredYears = years;

  const handleAddYear = () => {
    setEditingYear(null);
    setShowModal(true);
  };

  const handleEditYear = (year) => {
    setEditingYear(year);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingYear) {
        // Update
        console.log("editing year", editingYear);
        response = await apiUpdateAcademicYear({
          id: editingYear.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateAcademicYear({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingYear
            ? "Cập nhật năm học thành công"
            : "Thêm năm học thành công"
        );
        setShowModal(false);
        fetchAcademicYears();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi lưu năm học");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteYear = async (year) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa năm học "${year.name}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteAcademicYear({
          accessToken,
          id: year.id,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa năm học thành công");
          fetchAcademicYears();
        } else {
          showToastError(response.message || "Lỗi khi xóa năm học");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa năm học");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý năm học
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các năm học trong hệ thống
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
              placeholder="Tìm kiếm theo tên năm học..."
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddYear}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm năm học
          </Button>
        </div>
      </div>

      {/* Years Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : filteredYears.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {searchTerm
                ? "Không tìm thấy năm học nào"
                : "Chưa có năm học nào"}
            </p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Thử tìm kiếm với từ khóa khác
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-50 hover:to-blue-100/50">
                <TableHead className="font-semibold text-blue-900">
                  Tên năm học
                </TableHead>
                <TableHead className="font-semibold text-blue-900">
                  Ngày bắt đầu
                </TableHead>
                <TableHead className="font-semibold text-blue-900">
                  Ngày kết thúc
                </TableHead>
                <TableHead className="text-right font-semibold text-blue-900">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredYears.map((year) => (
                <TableRow
                  key={year.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {year.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(year.startDate)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(year.endDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditYear(year)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteYear(year)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Year Modal */}
      <AcademicYearFormModal
        open={showModal}
        onOpenChange={(isOpen) => {
          setShowModal(isOpen);
          if (!isOpen) {
            setEditingYear(null);
          }
        }}
        editingYear={editingYear}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AcademicYearManager;
