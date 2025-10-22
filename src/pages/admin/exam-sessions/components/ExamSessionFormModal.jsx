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
import { Search } from "lucide-react";
import LocationPickerModal from "./LocationPickerModal";

export default function ExamSessionFormModal({
  open,
  onOpenChange,
  editingSession,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
    description: "",
    location_id: null,
  });
  const [locationName, setLocationName] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data when editing
  useEffect(() => {
    if (editingSession) {
      setFormData({
        name: editingSession.name || "",
        start_date: editingSession.start_date
          ? new Date(editingSession.start_date).toISOString().slice(0, 16)
          : "",
        end_date: editingSession.end_date
          ? new Date(editingSession.end_date).toISOString().slice(0, 16)
          : "",
        is_active: editingSession.is_active ?? true,
        description: editingSession.description || "",
        location_id: editingSession.location_id || null,
      });
      setLocationName(editingSession.location?.name || "");
    } else {
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        is_active: true,
        description: "",
        location_id: null,
      });
      setLocationName("");
    }
    setErrors({});
  }, [editingSession, open]);

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, location_id: location.id });
    setLocationName(location.name);
    setShowLocationPicker(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên đợt thi không được để trống";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Ngày bắt đầu không được để trống";
    }
    if (!formData.end_date) {
      newErrors.end_date = "Ngày kết thúc không được để trống";
    }
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }
    if (!formData.location_id) {
      newErrors.location_id = "Vui lòng chọn cơ sở";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert datetime-local to ISO format
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };
      console.log(submitData);
      onSubmit(submitData);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingSession ? "Chỉnh sửa đợt thi" : "Thêm đợt thi mới"}
            </DialogTitle>
            <DialogDescription>
              {editingSession
                ? "Cập nhật thông tin đợt thi"
                : "Điền đầy đủ thông tin để tạo đợt thi mới"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Tên đợt thi */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên đợt thi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Học kỳ 1 - 2025"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Ngày giờ bắt đầu */}
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium">
                Ngày giờ bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            {/* Ngày giờ kết thúc */}
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium">
                Ngày giờ kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>

            {/* Cơ sở - Location Picker */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Cơ sở <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Chọn cơ sở..."
                  value={locationName}
                  readOnly
                  className={`flex-1 cursor-pointer ${
                    errors.location_id ? "border-red-500" : ""
                  }`}
                  onClick={() => setShowLocationPicker(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLocationPicker(true)}
                  className="px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.location_id && (
                <p className="text-sm text-red-500">{errors.location_id}</p>
              )}
              {formData.location_id && (
                <p className="text-xs text-gray-500">
                  ID Cơ sở: {formData.location_id}
                </p>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Trạng thái</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.is_active === true}
                    onChange={() =>
                      setFormData({ ...formData, is_active: true })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">Đang hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.is_active === false}
                    onChange={() =>
                      setFormData({ ...formData, is_active: false })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">Không hoạt động</span>
                </label>
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mô tả
              </Label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả cho đợt thi..."
              />
            </div>
          </form>

          <DialogFooter className="gap-2">
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang xử lý...
                </>
              ) : editingSession ? (
                "Cập nhật"
              ) : (
                "Thêm đợt thi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        onSelect={handleLocationSelect}
      />
    </>
  );
}
