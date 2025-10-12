import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Switch } from "../../../../components/ui/switch";
import { Building2, Users, MapPin, Hash, Search } from "lucide-react";
import { apiGetLocations } from "~/apis/locations";
import LocationSelectionModal from "./LocationSelectionModal";

const RoomFormModal = ({
  open,
  onOpenChange,
  editingRoom,
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
    clearErrors,
  } = useForm({
    defaultValues: {
      code: "",
      capacity: "",
      location_id: "",
      type: "LT",
      is_active: true,
    },
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const isActive = watch("is_active");
  const roomType = watch("type");

  useEffect(() => {
    const fetchInitialLocationName = async (id) => {
      try {
        // Dùng chính apiGetLocations để tìm theo ID, dù không tối ưu bằng getById
        const response = await apiGetLocations({ page: 1, limit: 1, id: id });
        if (response.code === 200 && response.data.rows.length > 0) {
          setSelectedLocationName(response.data.rows[0].name);
        } else {
          setSelectedLocationName(`Không tìm thấy ID: ${id}`);
        }
      } catch (error) {
        console.error("Failed to fetch location name", error);
        setSelectedLocationName(`Lỗi khi tải ID: ${id}`);
      }
    };
    if (editingRoom) {
      reset({
        code: editingRoom.code || "",
        capacity: editingRoom.capacity || "",
        location_id: editingRoom.location_id || "",
        type: editingRoom.type || "LT",
        is_active: editingRoom.is_active ?? true,
      });
      if (editingRoom.location_id) {
        fetchInitialLocationName(editingRoom.location_id);
      } else {
        setSelectedLocationName("");
      }
    } else {
      reset({
        code: "",
        capacity: "",
        location_id: "",
        type: "LT",
        is_active: true,
      });
    }
  }, [editingRoom, reset, open]);
  const handleSelectLocation = (location) => {
    if (location && location.id) {
      setValue("location_id", location.id, { shouldValidate: true });
      setSelectedLocationName(location.name);
      clearErrors("location_id");
    }
  };
  const handleFormSubmit = (data) => {
    const formattedData = {
      code: data.code,
      capacity: parseInt(data.capacity),
      location_id: parseInt(data.location_id),
      type: data.type,
      is_active: data.is_active,
    };
    onSubmit(formattedData);
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {editingRoom ? "Chỉnh sửa phòng thi" : "Thêm phòng thi mới"}
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  {editingRoom
                    ? "Cập nhật thông tin phòng thi"
                    : "Điền đầy đủ thông tin để tạo phòng thi mới"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Mã phòng và Loại phòng */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Hash className="h-4 w-4 text-gray-500" />
                  Mã phòng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: P101"
                  className={`h-11 ${
                    errors.code ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("code", {
                    required: "Vui lòng nhập mã phòng",
                    minLength: {
                      value: 2,
                      message: "Mã phòng phải có ít nhất 2 ký tự",
                    },
                    maxLength: {
                      value: 20,
                      message: "Mã phòng không được quá 20 ký tự",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Mã phòng chỉ được chứa chữ và số",
                    },
                  })}
                />
                {errors.code && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors.code.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Loại phòng <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={roomType}
                  onValueChange={(value) => setValue("type", value)}
                >
                  <SelectTrigger className="h-11">
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
                    <SelectItem value="HT">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Hỗn hợp (HT)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sức chứa và Mã cơ sở */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="capacity"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-gray-500" />
                  Sức chứa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="VD: 60"
                  className={`h-11 ${
                    errors.capacity ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("capacity", {
                    required: "Vui lòng nhập sức chứa",
                    min: {
                      value: 1,
                      message: "Sức chứa phải lớn hơn 0",
                    },
                    max: {
                      value: 500,
                      message: "Sức chứa không được quá 500",
                    },
                  })}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="font-medium">⚠</span>{" "}
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              {/* <div className="space-y-2">
                <Label
                  htmlFor="location_id"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Mã cơ sở <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location_id"
                  type="number"
                  placeholder="VD: 1"
                  className={`h-11 ${
                    errors.location_id
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  {...register("location_id", {
                    required: "Vui lòng nhập mã cơ sở",
                    min: {
                      value: 1,
                      message: "Mã cơ sở phải lớn hơn 0",
                    },
                  })}
                />
                {errors.location_id && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="font-medium">⚠</span>{" "}
                    {errors.location_id.message}
                  </p>
                )}
              </div>
               */}
              <div className="space-y-2">
                <Label
                  htmlFor="location_id"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Cơ sở <span className="text-red-500">*</span>
                </Label>
                {/* Input ẩn để react-hook-form đăng ký và validate */}
                <input
                  type="hidden"
                  {...register("location_id", {
                    required: "Vui lòng chọn một cơ sở",
                  })}
                />
                <div className="relative">
                  <Input
                    id="location_display"
                    readOnly
                    value={selectedLocationName}
                    placeholder="Nhấn để chọn cơ sở"
                    className={`h-11 pr-24 cursor-pointer ${
                      errors.location_id ? "border-red-500" : ""
                    }`}
                    onClick={() => setIsLocationModalOpen(true)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9"
                    onClick={() => setIsLocationModalOpen(true)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Chọn
                  </Button>
                </div>
                {errors.location_id && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="font-medium">⚠</span>{" "}
                    {errors.location_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Trạng thái hoạt động */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-100">
              <div className="space-y-1">
                <Label
                  htmlFor="is_active"
                  className="text-sm font-semibold text-gray-900"
                >
                  Trạng thái hoạt động
                </Label>
                <p className="text-sm text-gray-600">
                  {isActive
                    ? "Phòng có thể được sử dụng để xếp lịch thi"
                    : "Phòng tạm thời không được sử dụng"}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
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
              className="h-11 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : editingRoom ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LocationSelectionModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
};

export default RoomFormModal;
