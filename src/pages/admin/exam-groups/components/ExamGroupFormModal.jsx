import { useState, useEffect } from "react";
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
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Search, Users2 } from "lucide-react";
import CourseDepartmentPickerModal from "~/pages/admin/components/CourseDepartmentPickerModal";
import ExamSessionPickerModal from "~/pages/admin/exam-slots/components/ExamSessionPickerModal";

export default function ExamGroupFormModal({
  open,
  onOpenChange,
  editingGroup,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    expected_student_count: "",
    course_department_id: null,
    exam_session_id: null,
    required_room_type: "LT",
    status: "not_scheduled",
  });
  const [courseDepartmentName, setCourseDepartmentName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [showCourseDepartmentPicker, setShowCourseDepartmentPicker] =
    useState(false);
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data when editing
  useEffect(() => {
    if (editingGroup) {
      setFormData({
        expected_student_count:
          editingGroup.expected_student_count?.toString() || "",
        course_department_id: editingGroup.courseDepartment?.id || null,
        exam_session_id: editingGroup.examSession?.id || null,
        required_room_type: editingGroup.required_room_type || "LT",
        status: editingGroup.status || "not_scheduled",
      });

      // Set course department display name
      if (editingGroup.courseDepartment) {
        const courseName =
          editingGroup.courseDepartment.course?.nameCourse || "";
        const className = editingGroup.courseDepartment.classes?.name || "";
        const lecturerName = editingGroup.courseDepartment.lecturer?.name || "";
        setCourseDepartmentName(
          `${courseName} - ${className} - ${lecturerName}`
        );
      } else {
        setCourseDepartmentName("");
      }

      setSessionName(editingGroup.examSession?.name || "");
    } else {
      setFormData({
        expected_student_count: "",
        course_department_id: null,
        exam_session_id: null,
        required_room_type: "LT",
        status: "not_scheduled",
      });
      setCourseDepartmentName("");
      setSessionName("");
    }
    setErrors({});
  }, [editingGroup, open]);

  const handleCourseDepartmentSelect = (courseDepartment) => {
    setFormData({ ...formData, course_department_id: courseDepartment.id });
    const courseName = courseDepartment.course?.nameCourse || "";
    const className = courseDepartment.classes?.name || "";
    const lecturerName = courseDepartment.lecturer?.name || "";
    setCourseDepartmentName(`${courseName} - ${className} - ${lecturerName}`);
    setShowCourseDepartmentPicker(false);
  };

  const handleSessionSelect = (session) => {
    setFormData({ ...formData, exam_session_id: session.id });
    setSessionName(session.name);
    setShowSessionPicker(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.expected_student_count) {
      newErrors.expected_student_count =
        "Số lượng sinh viên không được để trống";
    } else if (parseInt(formData.expected_student_count) <= 0) {
      newErrors.expected_student_count = "Số lượng sinh viên phải lớn hơn 0";
    }

    if (!formData.course_department_id) {
      newErrors.course_department_id = "Vui lòng chọn đăng ký học phần";
    }

    if (!formData.exam_session_id) {
      newErrors.exam_session_id = "Vui lòng chọn đợt thi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert expected_student_count to number
      const submitData = {
        ...formData,
        expected_student_count: parseInt(formData.expected_student_count),
      };
      onSubmit(submitData);
    }
  };

  const statusOptions = [
    { value: "not_scheduled", label: "Chưa lên lịch" },
    { value: "scheduled", label: "Đã lên lịch" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Users2 className="h-6 w-6 text-amber-600" />
              {editingGroup ? "Chỉnh sửa nhóm thi" : "Thêm nhóm thi mới"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? "Cập nhật thông tin nhóm thi"
                : "Điền đầy đủ thông tin để tạo nhóm thi mới"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Số lượng sinh viên dự kiến */}
            <div className="space-y-2">
              <Label
                htmlFor="expected_student_count"
                className="text-sm font-medium"
              >
                Số lượng sinh viên dự kiến{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expected_student_count"
                type="number"
                min="1"
                placeholder="VD: 50"
                value={formData.expected_student_count}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_student_count: e.target.value,
                  })
                }
                className={
                  errors.expected_student_count ? "border-red-500" : ""
                }
              />
              {errors.expected_student_count && (
                <p className="text-sm text-red-500">
                  {errors.expected_student_count}
                </p>
              )}
            </div>

            {/* Đăng ký học phần - CourseDepartment Picker */}
            <div className="space-y-2">
              <Label
                htmlFor="course_department"
                className="text-sm font-medium"
              >
                Đăng ký học phần <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="course_department"
                  placeholder="Chọn đăng ký học phần..."
                  value={courseDepartmentName}
                  readOnly
                  onClick={() => setShowCourseDepartmentPicker(true)}
                  className={`flex-1 cursor-pointer ${
                    errors.course_department_id ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCourseDepartmentPicker(true)}
                  className="shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {formData.course_department_id && (
                <p className="text-xs text-gray-500">
                  ID: {formData.course_department_id}
                </p>
              )}
              {errors.course_department_id && (
                <p className="text-sm text-red-500">
                  {errors.course_department_id}
                </p>
              )}
            </div>

            {/* Đợt thi - Session Picker */}
            <div className="space-y-2">
              <Label htmlFor="exam_session" className="text-sm font-medium">
                Đợt thi <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="exam_session"
                  placeholder="Chọn đợt thi..."
                  value={sessionName}
                  readOnly
                  onClick={() => setShowSessionPicker(true)}
                  className={`flex-1 cursor-pointer ${
                    errors.exam_session_id ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSessionPicker(true)}
                  className="shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {formData.exam_session_id && (
                <p className="text-xs text-gray-500">
                  ID: {formData.exam_session_id}
                </p>
              )}
              {errors.exam_session_id && (
                <p className="text-sm text-red-500">{errors.exam_session_id}</p>
              )}
            </div>

            {/* Loại phòng */}
            <div className="space-y-2">
              <Label
                htmlFor="required_room_type"
                className="text-sm font-medium"
              >
                Loại phòng <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.required_room_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, required_room_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LT">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Lý thuyết (LT)
                    </div>
                  </SelectItem>
                  <SelectItem value="TH">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Thực hành (TH)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Trạng thái
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : editingGroup ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CourseDepartment Picker Modal */}
      <CourseDepartmentPickerModal
        open={showCourseDepartmentPicker}
        onOpenChange={setShowCourseDepartmentPicker}
        onSelect={handleCourseDepartmentSelect}
      />

      {/* Exam Session Picker Modal */}
      <ExamSessionPickerModal
        open={showSessionPicker}
        onOpenChange={setShowSessionPicker}
        onSelect={handleSessionSelect}
      />
    </>
  );
}
