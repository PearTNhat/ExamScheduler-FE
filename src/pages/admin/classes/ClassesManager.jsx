import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Users, BookOpen } from "lucide-react";
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
import ClassFormModal from "./components/ClassFormModal";
import {
  apiGetClasses,
  apiCreateClass,
  apiUpdateClass,
  apiDeleteClass,
} from "~/apis/classesApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const ClassesManager = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
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

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentParams.page || 1,
        limit: 10,
        classCode: currentParams.code,
      };
      const response = await apiGetClasses({ accessToken, params });
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

  useEffect(() => {
    fetchClasses();
  }, [currentParams.page, currentParams.code]);

  // Handle add class
  const handleAddClass = () => {
    setEditingClass(null);
    setShowModal(true);
  };

  // Handle edit class
  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingClass) {
        // Update
        response = await apiUpdateClass({
          id: editingClass.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateClass({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingClass
            ? "Cập nhật lớp học thành công"
            : "Thêm lớp học thành công"
        );
        setShowModal(false);
        fetchClasses();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi lưu lớp học");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteClass = async (classItem) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa lớp "${classItem.code}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteClass({
          id: classItem.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa lớp học thành công");
          fetchClasses();
        } else {
          showToastError(response.message || "Có lỗi xảy ra khi xóa lớp học");
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa lớp học");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("code", searchTerm.trim());
          prev.set("page", "1");
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
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý lớp học
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các lớp học trong hệ thống
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
              placeholder="Tìm kiếm theo mã lớp..."
              className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddClass}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm lớp học
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã lớp</TableHead>
              <TableHead className="font-semibold">Tên lớp</TableHead>
              <TableHead className="font-semibold">Khoa</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy lớp học phù hợp"
                        : "Chưa có lớp học nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm lớp học" để tạo lớp mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              classes?.map((classItem) => (
                <TableRow key={classItem.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 rounded">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>
                      {classItem.code}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {classItem.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {classItem.department?.departmentName || "Chưa có khoa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(classItem.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClass(classItem)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClass(classItem)}
                        title="Xóa"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Modal Add/Edit */}
      <ClassFormModal
        open={showModal}
        onOpenChange={setShowModal}
        editingClass={editingClass}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ClassesManager;
