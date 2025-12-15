import React from "react";
import {
  Plus,
  Search,
  Users,
  BookOpen,
  Trash2,
  Building2,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Pagination from "~/components/pagination/Pagination";

// Component Header
const PageHeader = ({ onAddClick }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Đăng ký Học phần
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý đăng ký môn học của sinh viên theo kỳ thi
          </p>
        </div>
      </div>
      {onAddClick && (
        <Button
          onClick={onAddClick}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm đăng ký học phần
        </Button>
      )}
    </div>
  </div>
);

// Component danh sách môn học với exam session selector trong header
const CoursesList = ({
  courses,
  loading,
  searchTerm,
  onSearchChange,
  onCourseSelect,
  onDeleteCourse,
  pagination,
  onPageChange,
  sessionStats,
  // Props cho exam session selector
  examSessions,
  selectedExamSession,
  onSelectExamSession,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Danh sách Môn học
      </CardTitle>
      {/* Thống kê tổng quan */}
      {sessionStats && selectedExamSession && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="flex flex-col p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600/80">
                Lớp học
              </span>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {sessionStats.totalClasses || 0}
            </span>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600/80">
                Khoa/Viện
              </span>
              <Building2 className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {sessionStats.totalDepartments || 0}
            </span>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col p-4 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-600/80">
                Lượt Đ.Ký
              </span>
              <FileCheck className="h-5 w-5 text-orange-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {sessionStats.totalRegistrations || 0}
            </span>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-600/80">
                Sinh viên
              </span>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {sessionStats.totalStudents || 0}
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Kỳ thi:</label>
          <Select
            value={selectedExamSession}
            onValueChange={onSelectExamSession}
            disabled={loading}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Chọn kỳ thi" />
            </SelectTrigger>
            <SelectContent>
              {examSessions?.map((session) => (
                <SelectItem key={session.id} value={session.id.toString()}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm môn học..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={!selectedExamSession}
          />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {!selectedExamSession ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 mb-2">
              Chọn kỳ thi để xem danh sách môn học
            </p>
            <p className="text-sm text-gray-400">
              Vui lòng chọn một kỳ thi từ dropdown ở trên
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Mã môn học</TableHead>
                  <TableHead className="font-semibold">Tên môn học</TableHead>
                  <TableHead className="font-semibold">Lớp</TableHead>
                  <TableHead className="font-semibold">Giảng viên</TableHead>
                  <TableHead className="font-semibold">Loại phòng</TableHead>
                  <TableHead className="font-semibold">Tín chỉ</TableHead>
                  <TableHead className="font-semibold">Thời gian thi</TableHead>
                  <TableHead className="font-semibold">
                    Đã đăng ký/Dự kiến
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="h-12 w-12 text-gray-300" />
                        <p className="font-medium text-gray-500">
                          Không có môn học nào
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses?.map((item) => (
                    <TableRow
                      key={item.courseDepartmentId}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          {item.codeCourse}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {item.nameCourse}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {item.className || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {item.lecturerName || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const rt = item.roomType || item.room_type || "LT";
                          const label =
                            rt === "Lab" ? " Phòng máy" : "Lý thuyết";
                          const variant =
                            rt === "Lab" ? "secondary" : "outline";
                          return <Badge variant={variant}>{label}</Badge>;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.credits} TC</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {item.duration_course_exam} phút
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              item.registeredCount > 0 ? "default" : "secondary"
                            }
                          >
                            {item.registeredCount}/{item.expected_students}
                          </Badge>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  (item.registeredCount /
                                    item.expected_students) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCourseSelect(item)}
                            className="flex items-center gap-2 hover:bg-blue-50"
                          >
                            <Users className="h-4 w-4" />
                            Quản lý SV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteCourse(item)}
                            disabled={item.registeredCount > 0}
                            className="flex items-center gap-2 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              item.registeredCount > 0
                                ? "Không thể xóa môn học đã có sinh viên đăng ký"
                                : "Xóa môn học"
                            }
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
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPageCount={pagination.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

export { PageHeader, CoursesList };
