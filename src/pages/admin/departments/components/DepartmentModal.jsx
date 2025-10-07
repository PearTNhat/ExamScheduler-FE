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
import { Building2, Hash } from "lucide-react";

const DepartmentFormModal = ({
  open,
  onOpenChange,
  editingDepartment,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentCode: "",
      departmentName: "",
    },
  });

  useEffect(() => {
    if (editingDepartment) {
      reset({
        departmentCode: editingDepartment.departmentCode || "",
        departmentName: editingDepartment.departmentName || "",
      });
    } else {
      reset({
        departmentCode: "",
        departmentName: "",
      });
    }
  }, [editingDepartment, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {editingDepartment
                  ? "Chỉnh sửa khoa/viện"
                  : "Thêm khoa/viện mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {editingDepartment
                  ? "Cập nhật thông tin khoa/viện"
                  : "Điền đầy đủ thông tin để tạo khoa/viện mới"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mã khoa/viện */}
          <div className="space-y-2">
            <Label
              htmlFor="departmentCode"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Hash className="h-4 w-4 text-gray-500" />
              Mã khoa/viện <span className="text-red-500">*</span>
            </Label>
            <Input
              id="departmentCode"
              placeholder="VD: CNTT"
              className={`h-11 ${
                errors.departmentCode ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("departmentCode", {
                required: "Vui lòng nhập mã khoa/viện",
                minLength: {
                  value: 2,
                  message: "Mã khoa/viện phải có ít nhất 2 ký tự",
                },
                maxLength: {
                  value: 20,
                  message: "Mã khoa/viện không được quá 20 ký tự",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Mã khoa/viện chỉ được chứa chữ và số",
                },
              })}
            />
            {errors.departmentCode && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span>{" "}
                {errors.departmentCode.message}
              </p>
            )}
          </div>

          {/* Tên khoa/viện */}
          <div className="space-y-2">
            <Label
              htmlFor="departmentName"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Building2 className="h-4 w-4 text-gray-500" />
              Tên khoa/viện <span className="text-red-500">*</span>
            </Label>
            <Input
              id="departmentName"
              placeholder="VD: Công Nghệ Thông Tin"
              className={`h-11 ${
                errors.departmentName ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("departmentName", {
                required: "Vui lòng nhập tên khoa/viện",
                minLength: {
                  value: 3,
                  message: "Tên khoa/viện phải có ít nhất 3 ký tự",
                },
                maxLength: {
                  value: 100,
                  message: "Tên khoa/viện không được quá 100 ký tự",
                },
              })}
            />
            {errors.departmentName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span>{" "}
                {errors.departmentName.message}
              </p>
            )}
          </div>

          {/* Thông tin hướng dẫn */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-amber-600 text-xl">💡</div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900">Lưu ý:</p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Mã khoa/viện phải là duy nhất và không trùng lặp</li>
                  <li>Tên khoa/viện nên đầy đủ và chính thức</li>
                  <li>
                    Khoa/viện sau khi tạo sẽ được sử dụng để phân loại môn học
                  </li>
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
            className="h-11 min-w-[120px] bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : editingDepartment ? (
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

export default DepartmentFormModal;
