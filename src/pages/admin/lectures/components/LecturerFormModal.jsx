// src/components/LecturerManager/LecturerFormModal.js

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { GraduationCap, Hash, User, Building2, UserCheck } from "lucide-react";

const LecturerFormModal = ({
  open,
  onOpenChange,
  editingLecturer,
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
      code: "",
      userId: "",
      departmentId: "",
      isSupervisor: false,
    },
  });

  const isSupervisor = watch("isSupervisor");

  useEffect(() => {
    if (editingLecturer) {
      reset({
        code: editingLecturer.code || "",
        userId: editingLecturer.userId || "",
        departmentId: editingLecturer.departmentId || "",
        isSupervisor: editingLecturer.isSupervisor || false,
      });
    } else {
      reset({
        code: "",
        userId: "",
        departmentId: "",
        isSupervisor: false,
      });
    }
  }, [editingLecturer, reset, open]);

  const handleFormSubmit = (data) => {
    // Chuyển đổi ID sang số nguyên trước khi gửi đi
    const formattedData = {
      ...data,
      userId: parseInt(data.userId, 10),
      departmentId: parseInt(data.departmentId, 10),
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {editingLecturer
                  ? "Chỉnh sửa giảng viên"
                  : "Thêm giảng viên mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {editingLecturer
                  ? "Cập nhật thông tin chi tiết của giảng viên."
                  : "Điền đầy đủ thông tin để tạo giảng viên mới."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-6 py-4">
            {/* Mã GV và User ID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  Mã giảng viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: GV001"
                  {...register("code", { required: "Vui lòng nhập mã GV" })}
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  User ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userId"
                  type="number"
                  placeholder="VD: 12"
                  {...register("userId", {
                    required: "Vui lòng nhập User ID",
                    min: { value: 1, message: "User ID phải lớn hơn 0" },
                  })}
                  className={errors.userId ? "border-red-500" : ""}
                />
                {errors.userId && (
                  <p className="text-sm text-red-500">
                    {errors.userId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Department ID */}
            <div className="space-y-2">
              <Label htmlFor="departmentId" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                Department ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="departmentId"
                type="number"
                placeholder="VD: 5"
                {...register("departmentId", {
                  required: "Vui lòng nhập Department ID",
                  min: { value: 1, message: "Department ID phải lớn hơn 0" },
                })}
                className={errors.departmentId ? "border-red-500" : ""}
              />
              {errors.departmentId && (
                <p className="text-sm text-red-500">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            {/* Vai trò giám thị */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100">
              <div className="space-y-1">
                <Label
                  htmlFor="isSupervisor"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Vai trò giám thị
                </Label>
                <p className="text-sm text-gray-600">
                  {isSupervisor
                    ? "Giảng viên này có thể làm giám thị coi thi."
                    : "Giảng viên này không có vai trò giám thị."}
                </p>
              </div>
              <Switch
                id="isSupervisor"
                checked={isSupervisor}
                onCheckedChange={(checked) => setValue("isSupervisor", checked)}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="h-11 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : editingLecturer ? (
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

export default LecturerFormModal;
