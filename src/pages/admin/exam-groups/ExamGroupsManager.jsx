import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Users2,
  BookOpen,
  Calendar,
  Building2,
  Hash,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  apiGetExamGroups,
  apiCreateExamGroup,
  apiUpdateExamGroup,
  apiDeleteExamGroup,
} from "~/apis/exam-groupsApi";
import { apiGetDepartments } from "~/apis/departmentsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import ExamGroupFormModal from "./components/ExamGroupFormModal";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const ExamGroupsManager = () => {
  const [examGroups, setExamGroups] = useState([]);
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

  // Filter states
  const [departments, setDepartments] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedExamSession, setSelectedExamSession] = useState("");

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exam groups
  const fetchExamGroups = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentParams.page || 1,
        limit: 10,
      };

      // Add filters if selected
      if (selectedDepartment) {
        params.departmentId = parseInt(selectedDepartment);
      }
      if (selectedExamSession) {
        params.examSessionId = parseInt(selectedExamSession);
      }

      const response = await apiGetExamGroups({ accessToken, params });
      if (response.code === 200) {
        setExamGroups(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách nhóm thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách nhóm thi");
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentParams, selectedDepartment, selectedExamSession]);

  useEffect(() => {
    if (accessToken) {
      fetchExamGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentParams]);

  // Load departments and exam sessions
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [deptRes, sessRes] = await Promise.all([
          apiGetDepartments({ accessToken }),
          apiGetExamSessions({ accessToken, params: { page: 1, limit: 100 } }),
        ]);

        if (deptRes.code === 200) {
          setDepartments(deptRes.data.data || []);
        }
        if (sessRes.code === 200) {
          setExamSessions(sessRes.data || []);
        }
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };

    if (accessToken) {
      loadFilters();
    }
  }, [accessToken]);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("code", searchTerm);
    } else {
      params.delete("code");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  // Filter handlers
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const handleExamSessionChange = (value) => {
    setSelectedExamSession(value);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedExamSession("");
    const params = new URLSearchParams();
    params.set("page", "1");
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
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingGroup) {
        response = await apiUpdateExamGroup({
          id: editingGroup.id,
          body: data,
          accessToken,
        });
      } else {
        response = await apiCreateExamGroup({ body: data, accessToken });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingGroup
            ? "Cập nhật nhóm thi thành công!"
            : "Thêm nhóm thi mới thành công!"
        );
        setIsModalOpen(false);
        setEditingGroup(null);
        fetchExamGroups();
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
  const handleDeleteGroup = async (group) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc muốn xóa nhóm thi "${group.code}"?`
    );
    if (confirmed) {
      try {
        const response = await apiDeleteExamGroup({
          id: group.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa nhóm thi thành công!");
          fetchExamGroups();
        } else {
          showToastError(response.message || "Lỗi khi xóa nhóm thi");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa nhóm thi");
      }
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      not_scheduled: {
        label: "Chưa lên lịch",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
      },
      scheduled: {
        label: "Đã lên lịch",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      },
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700 hover:bg-green-100",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700 hover:bg-red-100",
      },
    };

    const config = statusConfig[status] || statusConfig.not_scheduled;
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
            <Users2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý Nhóm thi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các nhóm thi cho học phần
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Khoa
            </label>
            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tất cả khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Kỳ thi
            </label>
            <Select
              value={selectedExamSession}
              onValueChange={handleExamSessionChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tất cả kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỳ thi</SelectItem>
                {examSessions.map((session) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleApplyFilters} className="flex-1 h-11">
              Áp dụng
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="h-11"
            >
              Đặt lại
            </Button>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã nhóm thi..."
              className="pl-10 h-11 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
              className="gap-2 h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Thêm nhóm thi
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-amber-50 to-amber-100/50 hover:from-amber-50 hover:to-amber-100/50">
              <TableHead className="font-semibold text-amber-900">Id</TableHead>
              <TableHead className="font-semibold text-amber-900">
                Học phần
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Khoa
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Đợt thi
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Số SV dự kiến
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Trạng thái
              </TableHead>
              <TableHead className="text-right font-semibold text-amber-900">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-amber-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : examGroups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users2 className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy nhóm thi phù hợp"
                        : "Chưa có nhóm thi nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm nhóm thi" để tạo nhóm thi mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              examGroups.map((group) => (
                <TableRow
                  key={group.id}
                  className="hover:bg-amber-50/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{group.id || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        {group.courseDepartment?.course?.nameCourse || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {group.courseDepartment?.department?.departmentName ||
                        "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">
                        {group.examSession?.name || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">
                        {group.expected_student_count || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(group.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(group)}
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGroup(group)}
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
        {!loading && examGroups.length > 0 && (
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
      <ExamGroupFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingGroup(null);
          }
        }}
        editingGroup={editingGroup}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ExamGroupsManager;
