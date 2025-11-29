import { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, Users2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { apiGetRooms } from "~/apis/roomsApi";
import { apiGetExamSlots } from "~/apis/exam-slotApi";
import { apiGetExamGroups } from "~/apis/exam-groupsApi";

const ExamFormModal = ({
  open,
  onOpenChange,
  editingExam,
  onSubmit,
  isSubmitting,
  accessToken,
}) => {
  const [formData, setFormData] = useState({
    examDate: "",
    roomId: "",
    examSlotId: "",
    examGroupId: "",
    duration: "",
    status: "oke",
  });
  console.log("s------", editingExam);

  const [errors, setErrors] = useState({});
  const [rooms, setRooms] = useState([]);
  const [examSlots, setExamSlots] = useState([]);
  const [examGroups, setExamGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách rooms, slots, groups
  useEffect(() => {
    if (open && accessToken) {
      loadData();
    }
  }, [open, accessToken]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, slotsRes, groupsRes] = await Promise.all([
        apiGetRooms({ params: { page: 1, limit: 1000 } }),
        apiGetExamSlots({ accessToken, params: { page: 1, limit: 100 } }),
        apiGetExamGroups({ accessToken, params: { page: 1, limit: 100 } }),
      ]);

      if (roomsRes.code === 200) {
        setRooms(roomsRes.data.data || []);
      }
      if (slotsRes.code === 200) {
        setExamSlots(slotsRes.data.data || []);
      }
      if (groupsRes.code === 200) {
        setExamGroups(groupsRes.data.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi edit
  useEffect(() => {
    if (editingExam) {
      setFormData({
        examDate: editingExam.exam_date || "",
        roomId: editingExam.room_id?.toString() || "",
        examSlotId: editingExam.exam_slot_id?.toString() || "",
        examGroupId: editingExam.exam_group_id?.toString() || "",
        duration: editingExam.duration?.toString() || "",
        status: editingExam.status || "oke",
      });
    } else {
      setFormData({
        examDate: "",
        roomId: "",
        examSlotId: "",
        examGroupId: "",
        duration: "",
        status: "oke",
      });
    }
    setErrors({});
  }, [editingExam, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.examDate.trim()) {
      newErrors.examDate = "Vui lòng chọn ngày thi";
    }

    if (!formData.roomId) {
      newErrors.roomId = "Vui lòng chọn phòng thi";
    }

    if (!formData.examSlotId) {
      newErrors.examSlotId = "Vui lòng chọn ca thi";
    }

    if (!formData.examGroupId) {
      newErrors.examGroupId = "Vui lòng chọn nhóm thi";
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = "Thời lượng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      examDate: formData.examDate,
      roomId: parseInt(formData.roomId),
      examSlotId: parseInt(formData.examSlotId),
      examGroupId: parseInt(formData.examGroupId),
      duration: parseInt(formData.duration),
      status: formData.status,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-blue-600" />
            {editingExam ? "Chỉnh sửa lịch thi" : "Thêm lịch thi mới"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Ngày thi */}
            <div className="space-y-2">
              <Label htmlFor="examDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Ngày thi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examDate}
                onChange={(e) => handleChange("examDate", e.target.value)}
                className={errors.examDate ? "border-red-500" : ""}
              />
              {errors.examDate && (
                <p className="text-sm text-red-500">{errors.examDate}</p>
              )}
            </div>

            {/* Phòng thi */}
            <div className="space-y-2">
              <Label htmlFor="roomId" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                Phòng thi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => handleChange("roomId", value)}
              >
                <SelectTrigger
                  className={errors.roomId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Chọn phòng thi" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.code} - {room.location?.name} (Sức chứa:{" "}
                      {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomId && (
                <p className="text-sm text-red-500">{errors.roomId}</p>
              )}
            </div>

            {/* Ca thi */}
            <div className="space-y-2">
              <Label htmlFor="examSlotId" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Ca thi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.examSlotId}
                onValueChange={(value) => handleChange("examSlotId", value)}
              >
                <SelectTrigger
                  className={errors.examSlotId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Chọn ca thi" />
                </SelectTrigger>
                <SelectContent>
                  {examSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.slotName} ({slot.startTime} - {slot.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.examSlotId && (
                <p className="text-sm text-red-500">{errors.examSlotId}</p>
              )}
            </div>

            {/* Nhóm thi */}
            <div className="space-y-2">
              <Label htmlFor="examGroupId" className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-amber-600" />
                Nhóm thi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.examGroupId}
                onValueChange={(value) => handleChange("examGroupId", value)}
              >
                <SelectTrigger
                  className={errors.examGroupId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Chọn nhóm thi" />
                </SelectTrigger>
                <SelectContent>
                  {examGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.code} - {group.course?.name} (SV:{" "}
                      {group.expected_student_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.examGroupId && (
                <p className="text-sm text-red-500">{errors.examGroupId}</p>
              )}
            </div>

            {/* Thời lượng */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Thời lượng (phút) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className={errors.duration ? "border-red-500" : ""}
                placeholder="Nhập thời lượng thi (phút)"
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />
                Trạng thái
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oke">OK</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>{editingExam ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExamFormModal;
