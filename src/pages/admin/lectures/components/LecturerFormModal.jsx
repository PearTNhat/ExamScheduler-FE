// src/components/LecturerManager/LecturerFormModal.js

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  GraduationCap,
  Hash,
  User,
  Building2,
  UserCheck,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import DepartmentPickerModal from "./DepartmentPickerModal";

const LecturerFormModal = ({
  open,
  onOpenChange,
  editingLecturer,
  onSubmit,
  isSubmitting,
}) => {
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lecturerCode: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      phoneNumber: "",
      isSupervisor: false,
      departmentId: "",
    },
  });

  const isSupervisor = watch("isSupervisor");
  const gender = watch("gender");

  useEffect(() => {
    if (editingLecturer) {
      console.log("editing lecture ;", editingLecturer);
      reset({
        lecturerCode: editingLecturer.lecturerCode || "",
        firstName: editingLecturer.firstName || "",
        lastName: editingLecturer.lastName || "",
        dateOfBirth: editingLecturer.dateOfBirth || "",
        gender: editingLecturer.gender || "male",
        address: editingLecturer.address || "",
        phoneNumber: editingLecturer.phoneNumber || "",
        isSupervisor: editingLecturer.isSupervisor || false,
        departmentId: editingLecturer.departmentId || "",
      });
      if (editingLecturer.department) {
        setSelectedDepartment(editingLecturer.department);
      }
    } else {
      reset({
        lecturerCode: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        phoneNumber: "",
        isSupervisor: false,
        departmentId: "",
      });
      setSelectedDepartment(null);
    }
  }, [editingLecturer, reset, open]);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setValue("departmentId", department.id);
    setShowDepartmentPicker(false);
  };

  const handleFormSubmit = (data) => {
    // Chuyển đổi ID sang số nguyên trước khi gửi đi
    const formattedData = {
      ...data,
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

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-h-[60vh] overflow-y-auto px-1"
        >
          <div className="space-y-6 py-4">
            {/* Mã GV */}
            <div className="space-y-2">
              <Label htmlFor="lecturerCode" className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                Mã giảng viên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lecturerCode"
                placeholder="VD: GV001"
                {...register("lecturerCode", {
                  required: "Vui lòng nhập mã GV",
                })}
                className={errors.lecturerCode ? "border-red-500" : ""}
              />
              {errors.lecturerCode && (
                <p className="text-sm text-red-500">
                  {errors.lecturerCode.message}
                </p>
              )}
            </div>

            {/* Họ và Tên */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Họ và tên đệm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="VD: Nguyễn Đình"
                  {...register("firstName", {
                    required: "Vui lòng nhập họ và tên đệm",
                  })}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="VD: Luật"
                  {...register("lastName", { required: "Vui lòng nhập tên" })}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Ngày sinh và Giới tính */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Vui lòng chọn ngày sinh",
                  })}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setValue("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="VD: 123 Đường ABC, Hà Nội"
                {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                placeholder="VD: 0912345678"
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ (10-11 số)",
                  },
                })}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Khoa */}
            <div className="space-y-2">
              <Label htmlFor="departmentId" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                Khoa <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="departmentId"
                  readOnly
                  value={
                    selectedDepartment
                      ? `${selectedDepartment.departmentCode} (ID: ${selectedDepartment.id})`
                      : ""
                  }
                  placeholder="Chọn khoa..."
                  className={`cursor-pointer ${
                    errors.departmentId ? "border-red-500" : ""
                  }`}
                  onClick={() => setShowDepartmentPicker(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDepartmentPicker(true)}
                >
                  <Building2 className="h-4 w-4" />
                </Button>
              </div>
              <input
                type="hidden"
                {...register("departmentId", {
                  required: "Vui lòng chọn khoa",
                })}
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

        {/* Department Picker Modal */}
        <DepartmentPickerModal
          open={showDepartmentPicker}
          onOpenChange={setShowDepartmentPicker}
          onSelect={handleDepartmentSelect}
        />

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
