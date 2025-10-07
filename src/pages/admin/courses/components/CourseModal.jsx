import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";
import { BookOpen, Hash, Users, Star, FileText } from "lucide-react";

const CourseFormModal = ({
  open,
  onOpenChange,
  editingCourse,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      codeCourse: "",
      nameCourse: "",
      description: "",
      credits: "",
      expected_students: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (editingCourse) {
      reset({
        codeCourse: editingCourse.codeCourse || "",
        nameCourse: editingCourse.nameCourse || "",
        description: editingCourse.description || "",
        credits: editingCourse.credits || "",
        expected_students: editingCourse.expected_students || "",
        is_active: editingCourse.is_active ?? true,
      });
    } else {
      reset({
        codeCourse: "",
        nameCourse: "",
        description: "",
        credits: "",
        expected_students: "",
        is_active: true,
      });
    }
  }, [editingCourse, reset, open]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      codeCourse: data.codeCourse,
      nameCourse: data.nameCourse,
      description: data.description,
      credits: parseInt(data.credits),
      expected_students: parseInt(data.expected_students),
      is_active: data.is_active,
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {editingCourse ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {editingCourse
                  ? "Cập nhật thông tin môn học"
                  : "Điền đầy đủ thông tin để tạo môn học mới"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mã môn học và Tên môn học */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="codeCourse"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <Hash className="h-4 w-4 text-gray-500" />
                Mã môn học <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codeCourse"
                placeholder="VD: CS101"
                className={`h-11 ${
                  errors.codeCourse ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...register("codeCourse", {
                  required: "Vui lòng nhập mã môn học",
                  minLength: {
                    value: 2,
                    message: "Mã môn học phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 20,
                    message: "Mã môn học không được quá 20 ký tự",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: "Mã môn học chỉ được chứa chữ và số",
                  },
                })}
              />
              {errors.codeCourse && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.codeCourse.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nameCourse"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4 text-gray-500" />
                Tên môn học <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nameCourse"
                placeholder="VD: Nhập môn Lập trình"
                className={`h-11 ${
                  errors.nameCourse ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...register("nameCourse", {
                  required: "Vui lòng nhập tên môn học",
                  minLength: {
                    value: 3,
                    message: "Tên môn học phải có ít nhất 3 ký tự",
                  },
                  maxLength: {
                    value: 100,
                    message: "Tên môn học không được quá 100 ký tự",
                  },
                })}
              />
              {errors.nameCourse && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.nameCourse.message}
                </p>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-gray-500" />
              Mô tả
            </Label>
            <textarea
              id="description"
              placeholder="VD: Học các khái niệm cơ bản về lập trình"
              className={`min-h-[80px] w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.description ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Mô tả không được quá 500 ký tự",
                },
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span>{" "}
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Tín chỉ và Sinh viên dự kiến */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="credits"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-gray-500" />
                Số tín chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                placeholder="VD: 3"
                className={`h-11 ${
                  errors.credits ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...register("credits", {
                  required: "Vui lòng nhập số tín chỉ",
                  min: {
                    value: 1,
                    message: "Số tín chỉ phải lớn hơn 0",
                  },
                  max: {
                    value: 10,
                    message: "Số tín chỉ không được quá 10",
                  },
                })}
              />
              {errors.credits && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.credits.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expected_students"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <Users className="h-4 w-4 text-gray-500" />
                Sinh viên dự kiến <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expected_students"
                type="number"
                placeholder="VD: 50"
                className={`h-11 ${
                  errors.expected_students
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("expected_students", {
                  required: "Vui lòng nhập số sinh viên dự kiến",
                  min: {
                    value: 1,
                    message: "Số sinh viên dự kiến phải lớn hơn 0",
                  },
                  max: {
                    value: 1000,
                    message: "Số sinh viên dự kiến không được quá 1000",
                  },
                })}
              />
              {errors.expected_students && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.expected_students.message}
                </p>
              )}
            </div>
          </div>

          {/* Trạng thái hoạt động */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-100">
            <div className="space-y-1">
              <Label
                htmlFor="is_active"
                className="text-sm font-semibold text-gray-900"
              >
                Trạng thái hoạt động
              </Label>
              <p className="text-sm text-gray-600">
                {isActive
                  ? "Môn học có thể được sử dụng để xếp lịch thi"
                  : "Môn học tạm thời không được sử dụng"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Thông tin hướng dẫn */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-amber-600 text-xl">💡</div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900">Lưu ý:</p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Mã môn học phải là duy nhất và không trùng lặp</li>
                  <li>Số tín chỉ thường từ 1-6 tín chỉ</li>
                  <li>Số sinh viên dự kiến giúp sắp xếp phòng thi phù hợp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
            className="h-11"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="h-11 min-w-[120px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : editingCourse ? (
              "Cập nhật"
            ) : (
              "Thêm mới"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormModal;
