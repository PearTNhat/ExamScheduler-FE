import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Calendar,
  Clock,
  Building2,
  Users2,
  Timer,
  CheckCircle,
} from "lucide-react";
import { apiCreateExam } from "~/apis/examsApi";
import { showToastSuccess, showToastError } from "~/utils/alert";
import ExamGroupPickerModal from "~/pages/admin/components/ExamGroupPickerModal";
import RoomPickerModal from "~/pages/admin/components/RoomPickerModal";
import ExamSlotPickerModal from "~/pages/admin/components/ExamSlotPickerModal";

const INITIAL_FORM_DATA = {
  exam_group_id: null,
  room_id: null,
  exam_slot_id: null,
  exam_date: "",
  duration: 90,
  status: "Draft",
};

export default function CreateExamModal({ open, onOpenChange, onExamCreated }) {
  const { accessToken } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Display names
  const [examGroupName, setExamGroupName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [examSlotName, setExamSlotName] = useState("");

  // Picker modals
  const [isExamGroupPickerOpen, setIsExamGroupPickerOpen] = useState(false);
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false);
  const [isExamSlotPickerOpen, setIsExamSlotPickerOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      setExamGroupName("");
      setRoomName("");
      setExamSlotName("");
    }
  }, [open]);

  const handleExamGroupSelect = (examGroup) => {
    setFormData((prev) => ({ ...prev, exam_group_id: examGroup.id }));
    setExamGroupName(
      `${examGroup.courseDepartment?.course?.nameCourse || ""} - ${
        examGroup.courseDepartment?.department?.departmentName || ""
      }`
    );
    setErrors((prev) => ({ ...prev, exam_group_id: "" }));
  };

  const handleRoomSelect = (rooms) => {
    // RoomPickerModal returns array, but we only need one room
    if (rooms && rooms.length > 0) {
      setFormData((prev) => ({ ...prev, room_id: rooms[0].roomId }));
      setRoomName(rooms[0].code);
      setErrors((prev) => ({ ...prev, room_id: "" }));
    }
    setIsRoomPickerOpen(false);
  };

  const handleExamSlotSelect = (examSlot) => {
    setFormData((prev) => ({ ...prev, exam_slot_id: examSlot.id }));
    setExamSlotName(
      `${examSlot.slotName} (${examSlot.startTime} - ${examSlot.endTime})`
    );
    setErrors((prev) => ({ ...prev, exam_slot_id: "" }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.exam_group_id) {
      newErrors.exam_group_id = "Vui lòng chọn nhóm thi";
    }
    if (!formData.room_id) {
      newErrors.room_id = "Vui lòng chọn phòng thi";
    }
    if (!formData.exam_slot_id) {
      newErrors.exam_slot_id = "Vui lòng chọn ca thi";
    }
    if (!formData.exam_date) {
      newErrors.exam_date = "Vui lòng chọn ngày thi";
    }
    // else {
    //   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    //   if (!dateRegex.test(formData.exam_date)) {
    //     newErrors.exam_date = "Ngày thi phải có định dạng YYYY-MM-DD";
    //   }
    // }
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Thời gian thi phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const body = {
        examGroupId: formData.exam_group_id,
        roomId: formData.room_id,
        examSlotId: formData.exam_slot_id,
        examDate: formData.exam_date
          ? new Date(formData.exam_date).toISOString()
          : undefined,
        duration: parseInt(formData.duration),
        status: formData.status,
      };

      const response = await apiCreateExam({ body, accessToken });

      if (response.code === 201 || response.code === 200) {
        showToastSuccess("Tạo lịch thi thành công");
        onExamCreated && onExamCreated();
        onOpenChange(false);
      } else {
        showToastError(response.message || "Lỗi khi tạo lịch thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tạo lịch thi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
              Tạo Lịch Thi Mới
            </DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo lịch thi mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Exam Group */}
            <div className="space-y-2">
              <Label htmlFor="exam_group">
                <Users2 className="h-4 w-4 inline mr-1" />
                Nhóm thi <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="exam_group"
                  value={examGroupName}
                  placeholder="Chọn nhóm thi"
                  readOnly
                  className={`flex-1 cursor-pointer ${
                    errors.exam_group_id ? "border-red-500" : ""
                  }`}
                  onClick={() => setIsExamGroupPickerOpen(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExamGroupPickerOpen(true)}
                >
                  Chọn
                </Button>
              </div>
              {errors.exam_group_id && (
                <p className="text-sm text-red-500">{errors.exam_group_id}</p>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="room">
                <Building2 className="h-4 w-4 inline mr-1" />
                Phòng thi <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="room"
                  value={roomName}
                  placeholder="Chọn phòng thi"
                  readOnly
                  className={`flex-1 cursor-pointer ${
                    errors.room_id ? "border-red-500" : ""
                  }`}
                  onClick={() => setIsRoomPickerOpen(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRoomPickerOpen(true)}
                >
                  Chọn
                </Button>
              </div>
              {errors.room_id && (
                <p className="text-sm text-red-500">{errors.room_id}</p>
              )}
            </div>

            {/* Exam Slot */}
            <div className="space-y-2">
              <Label htmlFor="exam_slot">
                <Clock className="h-4 w-4 inline mr-1" />
                Ca thi <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="exam_slot"
                  value={examSlotName}
                  placeholder="Chọn ca thi"
                  readOnly
                  className={`flex-1 cursor-pointer ${
                    errors.exam_slot_id ? "border-red-500" : ""
                  }`}
                  onClick={() => setIsExamSlotPickerOpen(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExamSlotPickerOpen(true)}
                >
                  Chọn
                </Button>
              </div>
              {errors.exam_slot_id && (
                <p className="text-sm text-red-500">{errors.exam_slot_id}</p>
              )}
            </div>

            {/* Exam Date */}
            <div className="space-y-2">
              <Label htmlFor="exam_date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Ngày thi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exam_date"
                type="date"
                value={formData.exam_date}
                onChange={(e) => handleInputChange("exam_date", e.target.value)}
                className={errors.exam_date ? "border-red-500" : ""}
              />
              {errors.exam_date && (
                <p className="text-sm text-red-500">{errors.exam_date}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">
                <Timer className="h-4 w-4 inline mr-1" />
                Thời gian thi (phút) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Đang xếp</SelectItem>
                  <SelectItem value="Confirmed">Đã xếp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Đang tạo..." : "Tạo lịch thi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Picker Modals */}
      <ExamGroupPickerModal
        open={isExamGroupPickerOpen}
        onOpenChange={setIsExamGroupPickerOpen}
        onSelect={handleExamGroupSelect}
      />

      <RoomPickerModal
        open={isRoomPickerOpen}
        onOpenChange={setIsRoomPickerOpen}
        onConfirm={handleRoomSelect}
        selectedRooms={formData.room_id ? [{ roomId: formData.room_id }] : []}
        singleSelect={true}
      />

      <ExamSlotPickerModal
        open={isExamSlotPickerOpen}
        onOpenChange={setIsExamSlotPickerOpen}
        onSelect={handleExamSlotSelect}
        multiSelect={false}
      />
    </>
  );
}
