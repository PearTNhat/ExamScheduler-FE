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
import { apiGetClasses } from "~/apis/classesApi";
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
  const [classes, setClasses] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamSession, setSelectedExamSession] = useState("");

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exam groups
  const fetchExamGroups = useCallback(async () => {
    try {
      console.log("call apu");
      setLoading(true);
      const params = {
        page: currentParams.page || 1,
        limit: 10,
      };

      // Add filters if selected (skip if 'all')
      if (selectedClass && selectedClass !== "all") {
        params.classId = parseInt(selectedClass);
      }
      if (selectedExamSession && selectedExamSession !== "all") {
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
  }, [accessToken, currentParams, selectedClass, selectedExamSession]);

  useEffect(() => {
    if (accessToken) {
      fetchExamGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentParams, selectedClass, selectedExamSession]);

  // Load classes and exam sessions
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [classRes, sessRes] = await Promise.all([
          apiGetClasses({ accessToken, params: { page: 1, limit: 1000 } }),
          apiGetExamSessions({ accessToken, params: { page: 1, limit: 100 } }),
        ]);

        if (classRes.code === 200) {
          setClasses(classRes.data.data || []);
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

  // Filter handlers
  const handleClassChange = (value) => {
    setSelectedClass(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleExamSessionChange = (value) => {
    console.log("sesisonId", value);
    setSelectedExamSession(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Lớp
            </label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tất cả lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
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

          {/* Add Button */}
          <div className="flex items-end">
            <Button
              onClick={handleOpenAddModal}
              className="gap-2 h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all w-full"
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
                Lớp
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Giảng viên
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Đợt thi
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Loại phòng
              </TableHead>
              <TableHead className="font-semibold text-amber-900">
                Tổng sinh viên
              </TableHead>
              <TableHead className="text-right font-semibold text-amber-900">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-amber-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : examGroups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users2 className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">Chưa có nhóm thi nào</p>
                    <p className="text-sm">
                      Nhấn "Thêm nhóm thi" để tạo nhóm thi mới
                    </p>
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
                      {group.courseDepartment?.classes?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {group.courseDepartment?.lecturer?.firstName +
                        " " +
                        group.courseDepartment?.lecturer?.lastName || "N/A"}
                    </span>
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
                    <Badge
                      variant={
                        group.required_room_type === "LT"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {group.required_room_type === "LT"
                        ? "Lý thuyết"
                        : "Thực hành"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">
                        {group.actual_student_count || 0}
                      </span>
                    </div>
                  </TableCell>
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
