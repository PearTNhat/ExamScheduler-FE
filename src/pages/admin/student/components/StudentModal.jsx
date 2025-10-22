// src/components/StudentManager/StudentFormModal.js
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"; // Điều chỉnh đường dẫn nếu cần
import { Button } from "~/components/ui/button"; // Điều chỉnh đường dẫn nếu cần
import { Label } from "~/components/ui/label"; // Điều chỉnh đường dẫn nếu cần
import { Input } from "~/components/ui/input"; // Điều chỉnh đường dẫn nếu cần
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"; // Điều chỉnh đường dẫn nếu cần
import {
  User,
  Hash,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Search,
} from "lucide-react";
import ClassPickerModal from "./ClassPickerModal";

const StudentFormModal = ({
  open,
  onOpenChange,
  editingStudent,
  onSubmit,
  isSubmitting,
}) => {
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [className, setClassName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentCode: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      phoneNumber: "",
      classId: null,
    },
  });

  const gender = watch("gender");
  const classId = watch("classId");

  useEffect(() => {
    if (editingStudent) {
      // Format date for the input type="date"
      const formattedDate = editingStudent.dateOfBirth
        ? new Date(editingStudent.dateOfBirth).toISOString().split("T")[0]
        : "";
      reset({
        studentCode: editingStudent.studentCode || "",
        firstName: editingStudent.firstName || "",
        lastName: editingStudent.lastName || "",
        dateOfBirth: formattedDate,
        gender: editingStudent.gender || "male",
        address: editingStudent.address || "",
        phoneNumber: editingStudent.phoneNumber || "",
        classId: editingStudent.classId || null,
      });
      setClassName(editingStudent.class?.name || "");
    } else {
      reset({
        studentCode: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        phoneNumber: "",
        classId: null,
      });
      setClassName("");
    }
  }, [editingStudent, reset, open]);

  const handleClassSelect = (classItem) => {
    setValue("classId", classItem.id);
    setClassName(classItem.name);
    setShowClassPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {editingStudent ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {editingStudent
                  ? "Cập nhật thông tin chi tiết của sinh viên."
                  : "Điền đầy đủ thông tin để tạo sinh viên mới."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Code */}
            <div className="space-y-2">
              <Label htmlFor="studentCode" className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                Mã sinh viên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentCode"
                placeholder="VD: 2001207001"
                {...register("studentCode", {
                  required: "Vui lòng nhập mã sinh viên",
                })}
                className={errors.studentCode ? "border-red-500" : ""}
              />
              {errors.studentCode && (
                <p className="text-sm text-red-500">
                  {errors.studentCode.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Họ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="VD: Nguyễn Văn"
                {...register("firstName", { required: "Vui lòng nhập họ" })}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="VD: An"
                {...register("lastName", { required: "Vui lòng nhập tên" })}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                placeholder="VD: 0912345678"
                {...register("phoneNumber")}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Ngày sinh
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Giới tính
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

            {/* Class - Class Picker */}
            <div className="space-y-2">
              <Label htmlFor="class" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Lớp học
              </Label>
              <div className="flex gap-2">
                <Input
                  id="class"
                  placeholder="Chọn lớp học..."
                  value={className}
                  readOnly
                  onClick={() => setShowClassPicker(true)}
                  className="flex-1 cursor-pointer"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowClassPicker(true)}
                  className="shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {classId && (
                <p className="text-xs text-gray-500">ID: {classId}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Địa chỉ
              </Label>
              <Input
                id="address"
                placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                {...register("address")}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              reset(); // Reset form when canceling
            }}
            className="h-11"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="h-11 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : editingStudent ? (
              "Cập nhật"
            ) : (
              "Thêm mới"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Class Picker Modal */}
      <ClassPickerModal
        open={showClassPicker}
        onOpenChange={setShowClassPicker}
        onSelect={handleClassSelect}
      />
    </Dialog>
  );
};

export default StudentFormModal;
