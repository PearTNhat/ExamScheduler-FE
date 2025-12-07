import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Users,
  Star,
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
import CourseFormModal from "./components/CourseModal";
import {
  apiGetCourses,
  apiCreateCourse,
  apiUpdateCourse,
  apiDeleteCourse,
} from "../../../apis/courseApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "../../../utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
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
  // Fetch courses
  const fetchCourses = async ({ accessToken }) => {
    try {
      setLoading(true);
      const params = {
        page: currentParams.page,
        limit: 10,
        codeCourse: currentParams.code,
      };
      const response = await apiGetCourses({ accessToken, params });
      if (response.code === 200) {
        setCourses(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách môn học");
      }
    } catch (error) {
      showToastError("Lỗi khi tải danh sách môn học");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCourses({ accessToken });
    }
  }, [accessToken, currentParams]);

  // Handle add course
  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  // Handle edit course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingCourse) {
        // Update
        response = await apiUpdateCourse({
          id: editingCourse.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateCourse({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200) {
        showToastSuccess(
          editingCourse
            ? "Cập nhật môn học thành công"
            : "Thêm môn học thành công"
        );
        setShowModal(false);
        fetchCourses({ accessToken });
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra");
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
  // Handle delete
  const handleDeleteCourse = async (course) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa môn học "${course.nameCourse}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteCourse({
          id: course.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa môn học thành công");
          fetchCourses({ accessToken });
        } else {
          showToastError(response.message || "Có lỗi xảy ra khi xóa môn học");
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa môn học");
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
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý môn học
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các môn học trong hệ thống
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
              placeholder="Tìm kiếm theo mã, tên môn học..."
              className="pl-10 h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddCourse}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm môn học
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Id</TableHead>
              <TableHead className="font-semibold">Mã môn học</TableHead>
              <TableHead className="font-semibold">Tên môn học</TableHead>
              <TableHead className="font-semibold">Tín chỉ</TableHead>
              <TableHead className="font-semibold">
                Thời gian thi (phút)
              </TableHead>
              {/* <TableHead className="font-semibold">Trạng thái</TableHead>  */}
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-purple-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy môn học phù hợp"
                        : "Chưa có môn học nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm môn học" để tạo môn học mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 rounded">
                        <Hash className="h-4 w-4 text-purple-600" />
                      </div>
                      {course.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 rounded">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                      </div>
                      {course.codeCourse}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{course.nameCourse}</p>
                      {course.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{course.credits}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{course.duration_course_exam}</span>
                    </div>
                  </TableCell>

                  {/* <TableCell>
                    {course.is_active ? (
                      <Badge variant="success" className="gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        Ngừng hoạt động
                      </Badge>
                    )}
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCourse(course)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCourse(course)}
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
      <CourseFormModal
        open={showModal}
        onOpenChange={setShowModal}
        editingCourse={editingCourse}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Courses;
