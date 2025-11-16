import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { BookOpen, Building2, Calendar, Plus } from "lucide-react";
import DepartmentPickerModal from "~/pages/admin/classes/components/DepartmentPickerModal";
import CoursePickerModal from "~/pages/admin/components/CoursePickerModal";

const AddCourseDepartmentModal = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  examSessions,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExamSession, setSelectedExamSession] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);

  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentPicker(false);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCoursePicker(false);
  };

  const handleSubmit = () => {
    if (!selectedDepartment || !selectedCourse || !selectedExamSession) {
      return;
    }

    const data = {
      courseId: selectedCourse.id,
      departmentId: selectedDepartment.id,
      examSessionId: parseInt(selectedExamSession),
      isCompulsory,
    };

    onSubmit(data);
  };

  const handleReset = () => {
    setSelectedDepartment(null);
    setSelectedCourse(null);
    setSelectedExamSession("");
    setIsCompulsory(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const isFormValid =
    selectedDepartment && selectedCourse && selectedExamSession;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-6 w-6 text-green-600" />
              Thêm Đăng Ký Học Phần
            </DialogTitle>
            <DialogDescription>
              Chọn môn học, khoa và kỳ thi để tạo đăng ký học phần mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Exam Session Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-blue-600" />
                Kỳ thi
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedExamSession}
                onValueChange={setSelectedExamSession}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kỳ thi" />
                </SelectTrigger>
                <SelectContent>
                  {examSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{session.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(session.start_date).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(session.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4 text-indigo-600" />
                Khoa
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {selectedDepartment ? (
                  <div className="flex-1 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-indigo-900">
                            {selectedDepartment.departmentName}
                          </p>
                          <p className="text-sm text-indigo-600">
                            Mã: {selectedDepartment.departmentCode}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDepartment(null)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        Thay đổi
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDepartmentPicker(true)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Chọn Khoa
                  </Button>
                )}
              </div>
            </div>

            {/* Course Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Môn học
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {selectedCourse ? (
                  <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">
                            {selectedCourse.nameCourse || selectedCourse.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            Mã:{" "}
                            {selectedCourse.codeCourse || selectedCourse.code}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCourse(null)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Thay đổi
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCoursePicker(true)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Chọn Môn học
                  </Button>
                )}
              </div>
            </div>

            {/* Is Compulsory Checkbox */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
              <Checkbox
                id="isCompulsory"
                checked={isCompulsory}
                onCheckedChange={setIsCompulsory}
              />
              <label
                htmlFor="isCompulsory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Môn học bắt buộc
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo đăng ký
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Department Picker Modal */}
      <DepartmentPickerModal
        open={showDepartmentPicker}
        onOpenChange={setShowDepartmentPicker}
        onSelect={handleDepartmentSelect}
      />

      {/* Course Picker Modal */}
      <CoursePickerModal
        open={showCoursePicker}
        onOpenChange={setShowCoursePicker}
        onSelect={handleCourseSelect}
      />
    </>
  );
};

export default AddCourseDepartmentModal;
