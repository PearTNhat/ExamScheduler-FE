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
import { BookOpen, Building2, Calendar, Plus, Users } from "lucide-react";
import ClassPickerModal from "~/pages/admin/components/ClassPickerModal";
import CoursePickerModal from "~/pages/admin/components/CoursePickerModal";
import ProctorPickerModal from "~/pages/admin/components/ProctorPickerModal";

const AddCourseDepartmentModal = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  examSessions,
}) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedExamSession, setSelectedExamSession] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);

  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [showProctorPicker, setShowProctorPicker] = useState(false);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setShowClassPicker(false);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCoursePicker(false);
  };

  const handleLecturerSelect = (lecturer) => {
    setSelectedLecturer(lecturer);
    setShowProctorPicker(false);
  };

  const handleSubmit = () => {
    if (
      !selectedClass ||
      !selectedCourse ||
      !selectedLecturer ||
      !selectedExamSession
    ) {
      return;
    }

    const data = {
      courseId: selectedCourse.id,
      classId: selectedClass.id,
      lecturerId: selectedLecturer.id,
      examSessionId: parseInt(selectedExamSession),
      isCompulsory,
    };

    onSubmit(data);
  };

  const handleReset = () => {
    setSelectedClass(null);
    setSelectedCourse(null);
    setSelectedLecturer(null);
    setSelectedExamSession("");
    setIsCompulsory(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const isFormValid =
    selectedClass && selectedCourse && selectedLecturer && selectedExamSession;

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

            {/* Class Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4 text-purple-600" />
                Lớp học
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {selectedClass ? (
                  <div className="flex-1 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-900">
                            {selectedClass.name}
                          </p>
                          <p className="text-sm text-purple-600">
                            Mã: {selectedClass.code}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClass(null)}
                        className="text-purple-600 hover:text-purple-700"
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
                    onClick={() => setShowClassPicker(true)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Chọn Lớp
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

            {/* Lecturer Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-green-600" />
                Giảng viên
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {selectedLecturer ? (
                  <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            {selectedLecturer.name}
                          </p>
                          <p className="text-sm text-green-600">
                            Mã: {selectedLecturer.lecturerCode}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLecturer(null)}
                        className="text-green-600 hover:text-green-700"
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
                    onClick={() => setShowProctorPicker(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Chọn Giảng viên
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

      {/* Class Picker Modal */}
      <ClassPickerModal
        open={showClassPicker}
        onOpenChange={setShowClassPicker}
        onSelect={handleClassSelect}
      />

      {/* Course Picker Modal */}
      <CoursePickerModal
        open={showCoursePicker}
        onOpenChange={setShowCoursePicker}
        onSelect={handleCourseSelect}
      />

      {/* Lecturer Picker Modal */}
      <ProctorPickerModal
        open={showProctorPicker}
        onOpenChange={setShowProctorPicker}
        onSelect={handleLecturerSelect}
        multiSelect={false}
        selectedProctors={[]}
      />
    </>
  );
};

export default AddCourseDepartmentModal;
