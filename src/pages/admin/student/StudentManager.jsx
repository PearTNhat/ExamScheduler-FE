import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  Download,
  User,
  Mail,
  Phone,
  Upload,
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
  apiGetStudents,
  apiDeleteStudent,
  apiUpdateStudent,
  apiCreateStudent,
  apiGetStudentById,
} from "~/apis/studentsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import StudentFormModal from "./components/StudentModal";
import StudentUploadModal from "./components/StudentUploadModal";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const StudentManager = () => {
  const [students, setStudents] = useState([]);
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
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = useCallback(
    async ({ currentParams }) => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const params = {
          page: currentParams.page,
          limit: 10,
          search: currentParams.code,
        };
        const res = await apiGetStudents({ accessToken, params });
        if (res.code === 200) {
          setStudents(res.data.data || []);
          setPagination({
            currentPage: res.data.meta.page,
            totalPages: res.data.meta.totalPages,
          });
        } else {
          showToastError(res.message || "Lỗi khi tải danh sách sinh viên");
        }
      } catch (err) {
        showToastError("Không thể tải danh sách sinh viên");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, currentParams.page, currentParams.name]
  );

  useEffect(() => {
    fetchStudents({ currentParams });
  }, [fetchStudents, currentParams]);
  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = async (student) => {
    try {
      const response = await apiGetStudentById({
        id: student.id,
        accessToken,
      });
      if (response.code === 200) {
        setEditingStudent(response.data);
        setIsModalOpen(true);
      } else {
        showToastError(response.message || "Lỗi khi tải thông tin sinh viên");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải thông tin sinh viên");
    }
  };
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingStudent) {
        response = await apiUpdateStudent({
          id: editingStudent.id,
          body: data,
          accessToken,
        });
        if (response.code === 200) {
          showToastSuccess("Cập nhật sinh viên thành công!");
        }
      } else {
        response = await apiCreateStudent({ body: data, accessToken });
        if (response.code === 200) {
          showToastSuccess("Thêm sinh viên mới thành công!");
        }
      }
      if (response.code !== 200) {
        showToastError(response.message || "Có lỗi xảy ra");
      } else {
        setIsModalOpen(false);
        setEditingStudent(null);
        fetchStudents({ currentParams });
      }
    } catch (error) {
      showToastError(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
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
  const handleDelete = async (student) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa sinh viên "${student.firstName} ${student.lastName}"?`
    );
    if (confirmed) {
      try {
        const response = await apiDeleteStudent({
          id: student.id,
          accessToken,
        });
        if (response.code === 200) {
          showToastSuccess("Xóa sinh viên thành công");
          fetchStudents({ currentParams });
        } else {
          showToastError(response.message || "Lỗi khi xóa sinh viên");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra khi xóa sinh viên");
      }
    }
  };
  // Export data
  const exportData = () => {
    const csvContent = [
      [
        "Mã SV",
        "Họ",
        "Tên",
        "Email",
        "Điện thoại",
        "Ngày sinh",
        "Giới tính",
        "Địa chỉ",
      ].join(","),
      ...students.map((s) =>
        [
          s.studentCode,
          s.firstName,
          s.lastName,
          s.email,
          s.phoneNumber,
          s.dateOfBirth,
          s.gender === "male" ? "Nam" : "Nữ",
          `"${s.address}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_sinh_vien.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý sinh viên
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý thông tin sinh viên và theo dõi kết quả học tập
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
              placeholder="Tìm kiếm theo mã SV, tên, email..."
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="outline"
              className="gap-2 h-11 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
            >
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              className="gap-2 h-11"
            >
              <Download className="h-4 w-4" />
              Xuất Excel
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Thêm sinh viên
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã SV</TableHead>
              <TableHead className="font-semibold">Họ tên</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Điện thoại</TableHead>
              <TableHead className="font-semibold">Giới tính</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy sinh viên phù hợp"
                        : "Chưa có sinh viên nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm sinh viên" để tạo sinh viên mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      {student.studentCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {`${student.firstName} ${student.lastName}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{student.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.gender === "male" ? "default" : "secondary"
                      }
                    >
                      {student.gender === "male" ? "Nam" : "Nữ"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(student.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Chỉnh sửa"
                        onClick={() => handleOpenEditModal(student)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student)}
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
      <StudentFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingStudent={editingStudent}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
      <StudentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadSuccess={() => fetchStudents({ currentParams })}
      />
    </div>
  );
};

export default StudentManager;
