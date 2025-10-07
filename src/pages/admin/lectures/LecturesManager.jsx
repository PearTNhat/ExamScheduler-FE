import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import FormField, {
  FormCheckbox,
} from "../../../components/formFiled/FormField";
import {
  apiGetLecturers,
  apiCreateLecturer,
  apiUpdateLecturer,
  apiDeleteLecturer,
} from "../../../apis/lectures";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "../../../utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";

const LecturesManager = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      code: "",
      userId: "",
      departmentId: "",
      isSupervisor: false,
    },
  });

  // Fetch lecturers
  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await apiGetLecturers();
      if (response.success) {
        setLecturers(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách giảng viên");
      }
    } catch (error) {
      showToastError("Lỗi khi tải danh sách giảng viên");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

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

  // Handle add lecturer
  const handleAddLecturer = () => {
    setEditingLecturer(null);
    reset({
      code: "",
      userId: "",
      departmentId: "",
      isSupervisor: false,
    });
    setShowModal(true);
  };

  // Handle edit lecturer
  const handleEditLecturer = (lecturer) => {
    setEditingLecturer(lecturer);
    reset({
      code: lecturer.code || "",
      userId: lecturer.userId?.toString() || "",
      departmentId: lecturer.departmentId?.toString() || "",
      isSupervisor: lecturer.isSupervisor || false,
    });
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      const submitData = {
        code: data.code,
        userId: parseInt(data.userId),
        departmentId: parseInt(data.departmentId),
        isSupervisor: data.isSupervisor,
      };

      let response;

      if (editingLecturer) {
        // Update
        response = await apiUpdateLecturer({
          id: editingLecturer.id,
          body: submitData,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateLecturer({
          body: submitData,
          accessToken,
        });
      }

      if (response.success) {
        showToastSuccess(
          editingLecturer
            ? "Cập nhật giảng viên thành công"
            : "Thêm giảng viên thành công"
        );
        setShowModal(false);
        fetchLecturers();
        reset();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError("Có lỗi xảy ra khi lưu giảng viên");
      console.error(error);
    }
  };

  // Handle delete
  const handleDeleteLecturer = async (lecturer) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa giảng viên "${lecturer.code}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteLecturer({
          id: lecturer.id,
          accessToken,
        });

        if (response.success) {
          showToastSuccess("Xóa giảng viên thành công");
          fetchLecturers();
        } else {
          showToastError(
            response.message || "Có lỗi xảy ra khi xóa giảng viên"
          );
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa giảng viên");
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
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng giảng viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {lecturers.length}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Giám thị</p>
              <p className="text-2xl font-bold text-green-600">
                {lecturers.filter((l) => l.isSupervisor).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Giảng viên</p>
              <p className="text-2xl font-bold text-blue-600">
                {lecturers.filter((l) => !l.isSupervisor).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
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
              placeholder="Tìm kiếm theo tên, email, khoa..."
              className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddLecturer}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all"
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 rounded">
                        <GraduationCap className="h-4 w-4 text-indigo-600" />
                      </div>
                      {lecturer.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {`${lecturer.user?.firstName || ""} ${
                        lecturer.user?.lastName || ""
                      }`.trim() || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {lecturer.user?.email || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {lecturer.department?.departmentName || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lecturer.isSupervisor ? (
                      <Badge variant="success" className="gap-1">
                        <UserCheck className="h-3 w-3" />
                        Giám thị
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1">
                        <Users className="h-3 w-3" />
                        Giảng viên
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(lecturer.createAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLecturer(lecturer)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLecturer(lecturer)}
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
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingLecturer ? "Chỉnh sửa giảng viên" : "Thêm giảng viên mới"}
            </DialogTitle>
            <DialogDescription>
              {editingLecturer
                ? "Cập nhật thông tin giảng viên"
                : "Điền thông tin giảng viên mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                name="code"
                control={control}
                label="Mã giảng viên"
                placeholder="Ví dụ: GV001"
                required
                rules={{
                  minLength: {
                    value: 2,
                    message: "Mã giảng viên phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 20,
                    message: "Mã giảng viên không được quá 20 ký tự",
                  },
                }}
              />

              <FormField
                name="userId"
                control={control}
                label="User ID"
                type="number"
                placeholder="Ví dụ: 1"
                required
                rules={{
                  min: {
                    value: 1,
                    message: "User ID phải lớn hơn 0",
                  },
                }}
              />

              <FormField
                name="departmentId"
                control={control}
                label="Department ID"
                type="number"
                placeholder="Ví dụ: 1"
                required
                rules={{
                  min: {
                    value: 1,
                    message: "Department ID phải lớn hơn 0",
                  },
                }}
              />

              <FormCheckbox
                name="isSupervisor"
                control={control}
                label="Là giám thị"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  reset();
                }}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang lưu..."
                  : editingLecturer
                  ? "Cập nhật"
                  : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturesManager;
