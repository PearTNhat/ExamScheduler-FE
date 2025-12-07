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
import { Textarea } from "~/components/ui/textarea";
import { Search, Clock } from "lucide-react";
import ExamSessionPickerModal from "./ExamSessionPickerModal";

export default function ExamSlotFormModal({
  open,
  onOpenChange,
  editingSlot,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    examSessionId: null,
    description: "",
  });
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data when editing
  useEffect(() => {
    if (editingSlot) {
      setFormData({
        slotName: editingSlot.slotName || "",
        startTime: editingSlot.startTime || "",
        endTime: editingSlot.endTime || "",
        description: editingSlot.description || "",
      });
    } else {
      setFormData({
        slotName: "",
        startTime: "",
        endTime: "",
        description: "",
      });
    }
    setErrors({});
  }, [editingSlot, open]);

  const handleSessionSelect = (session) => {
    setFormData({ ...formData, examSessionId: session.id });
    setExamSessionName(session.name);
    setShowSessionPicker(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.slotName.trim()) {
      newErrors.slotName = "Tên ca thi không được để trống";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Giờ bắt đầu không được để trống";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Giờ kết thúc không được để trống";
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu";
      }
    }

    // if (!formData.examSessionId) {
    //   newErrors.examSessionId = "Vui lòng chọn đợt thi";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-teal-600" />
              {editingSlot ? "Chỉnh sửa ca thi" : "Thêm ca thi mới"}
            </DialogTitle>
            <DialogDescription>
              {editingSlot
                ? "Cập nhật thông tin ca thi"
                : "Điền đầy đủ thông tin để tạo ca thi mới"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Tên ca thi */}
            <div className="space-y-2">
              <Label htmlFor="slotName" className="text-sm font-medium">
                Tên ca thi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slotName"
                placeholder="VD: Ca 1 - Sáng"
                value={formData.slotName}
                onChange={(e) =>
                  setFormData({ ...formData, slotName: e.target.value })
                }
                className={errors.slotName ? "border-red-500" : ""}
              />
              {errors.slotName && (
                <p className="text-sm text-red-500">{errors.slotName}</p>
              )}
            </div>

            {/* Giờ bắt đầu */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className={errors.startTime ? "border-red-500" : ""}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            {/* Giờ kết thúc */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">
                Giờ kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className={errors.endTime ? "border-red-500" : ""}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mô tả
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Nhập mô tả cho ca thi..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none"
              />
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
              ) : editingSlot ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
