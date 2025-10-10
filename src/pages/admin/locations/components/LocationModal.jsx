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
import { MapPin, Hash, Building } from "lucide-react";

const LocationFormModal = ({
  open,
  onOpenChange,
  editingLocation,
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
      code: "",
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    if (editingLocation) {
      reset({
        code: editingLocation.code || "",
        name: editingLocation.name || "",
        address: editingLocation.address || "",
      });
    } else {
      reset({
        code: "",
        name: "",
        address: "",
      });
    }
  }, [editingLocation, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {editingLocation ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {editingLocation
                  ? "Cập nhật thông tin cơ sở"
                  : "Điền đầy đủ thông tin để tạo cơ sở mới"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mã cơ sở */}
          <div className="space-y-2">
            <Label
              htmlFor="code"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Hash className="h-4 w-4 text-gray-500" />
              Mã cơ sở <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="VD: CS001"
              className={`h-11 ${
                errors.code ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("code", {
                required: "Vui lòng nhập mã cơ sở",
                minLength: {
                  value: 2,
                  message: "Mã cơ sở phải có ít nhất 2 ký tự",
                },
                maxLength: {
                  value: 20,
                  message: "Mã cơ sở không được quá 20 ký tự",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Mã cơ sở chỉ được chứa chữ và số",
                },
              })}
            />
            {errors.code && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.code.message}
              </p>
            )}
          </div>

          {/* Tên cơ sở */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Building className="h-4 w-4 text-gray-500" />
              Tên cơ sở <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Cơ sở Man Thiện"
              className={`h-11 ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("name", {
                required: "Vui lòng nhập tên cơ sở",
                minLength: {
                  value: 3,
                  message: "Tên cơ sở phải có ít nhất 3 ký tự",
                },
                maxLength: {
                  value: 100,
                  message: "Tên cơ sở không được quá 100 ký tự",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.name.message}
              </p>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              Địa chỉ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="VD: 97 Man Thiện"
              className={`h-11 ${
                errors.address ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("address", {
                required: "Vui lòng nhập địa chỉ",
                minLength: {
                  value: 5,
                  message: "Địa chỉ phải có ít nhất 5 ký tự",
                },
                maxLength: {
                  value: 200,
                  message: "Địa chỉ không được quá 200 ký tự",
                },
              })}
            />
            {errors.address && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.address.message}
              </p>
            )}
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
            className="h-11 min-w-[120px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : editingLocation ? (
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

export default LocationFormModal;
