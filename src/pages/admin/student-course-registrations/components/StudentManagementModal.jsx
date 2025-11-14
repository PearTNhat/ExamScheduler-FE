import React, { useState, useEffect, useMemo } from "react";
import { Search, Users, X, Plus, Minus, Check, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import Pagination from "~/components/pagination/Pagination";
import StudentPickerModal from "../../view-schedule/components/StudentPickerModal";

const StudentManagementModal = ({
  isOpen,
  onClose,
  course,
  students,
  loading,
  searchTerm,
  onSearchChange,
  selectedStudents,
  onStudentSelect,
  onSelectAllInPage,
  isAllPageSelected,
  onBulkUpdate,
  bulkLoading,
  pagination,
  onPageChange,
  examSessionId, // Thêm prop này để truyền vào StudentPickerModal
}) => {
  const [originalStudentIds, setOriginalStudentIds] = useState(new Set());
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  // Set original state khi modal mở
  useEffect(() => {
    if (isOpen && students.length > 0) {
      const registeredIds = students
        .filter((item) => item.isRegistered)
        .map((item) => item.id);
      setOriginalStudentIds(new Set(registeredIds));
    }
  }, [isOpen, students]);
  // Xử lý khi chọn sinh viên từ StudentPickerModal
  const handleStudentPickerConfirm = (pickedStudents) => {
    // Thêm các sinh viên đã chọn vào selectedStudents
    pickedStudents.forEach((pickedStudent) => {
      if (!selectedStudents.includes(pickedStudent.id)) {
        onStudentSelect(pickedStudent.id, true);
      }
    });

    setShowStudentPicker(false);
  };

  // Tính toán sự khác biệt như ExamEditModal
  const getChanges = useMemo(() => {
    const currentSelectedSet = new Set(selectedStudents);
    const originalSet = originalStudentIds;

    // Tìm những sinh viên được thêm mới (có trong selected nhưng không có trong original)
    const toAdd = Array.from(currentSelectedSet).filter(
      (studentId) => !originalSet.has(studentId)
    );

    // Tìm những sinh viên bị xóa (có trong original nhưng không có trong selected)
    const toRemove = Array.from(originalSet).filter(
      (studentId) => !currentSelectedSet.has(studentId)
    );

    return { toAdd, toRemove };
  }, [selectedStudents, originalStudentIds]);

  const handleSave = async () => {
    const { toAdd, toRemove } = getChanges;

    if (toAdd.length === 0 && toRemove.length === 0) {
      onClose();
      return;
    }

    const changes = {
      examSessionId,
      courseId: course.id,
    };

    if (toAdd.length > 0) changes.addStudentIds = toAdd;
    if (toRemove.length > 0) changes.removeStudentIds = toRemove;

    await onBulkUpdate(changes);
    onClose();
  };

  const hasChanges =
    getChanges.toAdd.length > 0 || getChanges.toRemove.length > 0;

  const getChangesSummary = () => {
    const { toAdd, toRemove } = getChanges;
    const parts = [];
    if (toAdd.length > 0) parts.push(`+${toAdd.length} thêm`);
    if (toRemove.length > 0) parts.push(`-${toRemove.length} xóa`);
    return parts.join(", ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quản lý Sinh viên - {course?.nameCourse}
          </DialogTitle>
          <DialogDescription>
            Chọn hoặc bỏ chọn sinh viên để thay đổi danh sách đăng ký môn học
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 p-1">
          {/* Filters */}
          <div className="flex-shrink-0 bg-white rounded-lg border p-4">
            <div className="flex gap-4">
              <div className="relative flex-1 ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sinh viên..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowStudentPicker(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm sinh viên
              </Button>
            </div>
          </div>

          {/* Changes info */}
          {hasChanges && (
            <div className="flex-shrink-0 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Thay đổi: {getChangesSummary()}
                </span>
              </div>
              <div className="text-xs text-blue-600">
                Nhấn "Lưu thay đổi" để áp dụng
              </div>
            </div>
          )}

          {/* Students table */}
          <div className="flex-1 overflow-auto bg-white rounded-lg border">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={isAllPageSelected}
                            onCheckedChange={onSelectAllInPage}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">Mã SV</TableHead>
                        <TableHead className="font-semibold">Họ tên</TableHead>
                        <TableHead className="font-semibold">Lớp</TableHead>
                        <TableHead className="font-semibold">SĐT</TableHead>
                        <TableHead className="font-semibold">
                          Thay đổi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-12 w-12 text-gray-300" />
                              <p className="font-medium text-gray-500">
                                Không có sinh viên nào
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((item) => {
                          const isSelected = selectedStudents.includes(item.id);
                          const wasOriginallyRegistered =
                            originalStudentIds.has(item.id);
                          const isChanged =
                            isSelected !== wasOriginallyRegistered;

                          return (
                            <TableRow
                              key={item.id}
                              className={`hover:bg-gray-50 cursor-pointer ${
                                isChanged ? "bg-yellow-50" : ""
                              }`}
                              onClick={() =>
                                onStudentSelect(item.id, !isSelected)
                              }
                            >
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    onStudentSelect(item.id, checked)
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-blue-100 rounded">
                                    <Users className="h-3 w-3 text-blue-600" />
                                  </div>
                                  {item.studentCode}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.firstName} {item.lastName}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {item.classes?.className || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {item.phoneNumber || "N/A"}
                              </TableCell>

                              <TableCell>
                                {isChanged && (
                                  <Badge
                                    variant={
                                      isSelected ? "default" : "destructive"
                                    }
                                  >
                                    {isSelected &&
                                      !wasOriginallyRegistered &&
                                      "Thêm"}
                                    {!isSelected &&
                                      wasOriginallyRegistered &&
                                      "Xóa"}
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex-shrink-0 p-4 border-t">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {hasChanges ? "Hủy" : "Đóng"}
          </Button>
          {hasChanges && (
            <Button onClick={handleSave} disabled={bulkLoading}>
              {bulkLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Lưu thay đổi ({getChangesSummary()})
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Student Picker Modal */}
      <StudentPickerModal
        open={showStudentPicker}
        onOpenChange={setShowStudentPicker}
        onConfirm={handleStudentPickerConfirm}
        selectedStudents={students
          .filter((item) => selectedStudents.includes(item.id))
          .map((item) => ({
            id: item.id,
            studentCode: item.studentCode,
            className: item.classes?.className,
            fullName: `${item.firstName} ${item.lastName}`,
          }))}
      />
    </Dialog>
  );
};

export default StudentManagementModal;
