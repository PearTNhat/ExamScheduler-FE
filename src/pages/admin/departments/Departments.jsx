import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Building2, Users } from "lucide-react";
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
import DepartmentFormModal from "./components/DepartmentModal";
import {
  apiGetDepartments,
  apiCreateDepartment,
  apiUpdateDepartment,
  apiDeleteDepartment,
} from "../../../apis/departments";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "../../../utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state) => state.user);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiGetDepartments();
      if (response.code === 200) {
        setDepartments(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách khoa/viện");
      }
    } catch (error) {
      showToastError("Lỗi khi tải danh sách khoa/viện");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments
  const filteredDepartments = departments.filter((department) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      department.departmentCode?.toLowerCase().includes(searchLower) ||
      department.departmentName?.toLowerCase().includes(searchLower)
    );
  });

  // Handle add department
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowModal(true);
  };

  // Handle edit department
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingDepartment) {
        // Update
        response = await apiUpdateDepartment({
          id: editingDepartment.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateDepartment({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200) {
        showToastSuccess(
          editingDepartment
            ? "Cập nhật khoa/viện thành công"
            : "Thêm khoa/viện thành công"
        );
        setShowModal(false);
        fetchDepartments();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError("Có lỗi xảy ra khi lưu khoa/viện");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteDepartment = async (department) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa khoa/viện "${department.departmentName}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteDepartment({
          id: department.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa khoa/viện thành công");
          fetchDepartments();
        } else {
          showToastError(response.message || "Có lỗi xảy ra khi xóa khoa/viện");
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa khoa/viện");
        console.error(error);
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
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý khoa/viện
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các khoa/viện trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng khoa/viện</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {departments.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
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
              placeholder="Tìm kiếm theo mã, tên khoa/viện..."
              className="pl-10 h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddDepartment}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm khoa/viện
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã khoa/viện</TableHead>
              <TableHead className="font-semibold">Tên khoa/viện</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-orange-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy khoa/viện phù hợp"
                        : "Chưa có khoa/viện nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm khoa/viện" để tạo khoa/viện mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-100 rounded">
                        <Building2 className="h-4 w-4 text-orange-600" />
                      </div>
                      {department.departmentCode}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {department.departmentName}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(department.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditDepartment(department)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDepartment(department)}
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
      </div>

      {/* Modal Add/Edit */}
      <DepartmentFormModal
        open={showModal}
        onOpenChange={setShowModal}
        editingDepartment={editingDepartment}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Departments;
