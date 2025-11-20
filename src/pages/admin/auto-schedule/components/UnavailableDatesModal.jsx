import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Calendar, Trash2, Plus } from "lucide-react";
import ExamSlotPickerModal from "../../components/ExamSlotPickerModal";

export default function UnavailableDatesModal({
  open,
  onOpenChange,
  proctor,
  onSave,
}) {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    if (open && proctor) {
      setUnavailableDates(proctor.unavailable_dates || []);
    }
  }, [open, proctor]);

  const handleAddDate = () => {
    if (!currentDate) return;

    // Kiểm tra ngày đã tồn tại chưa
    const existingIndex = unavailableDates.findIndex(
      (d) => d.date === currentDate
    );

    if (existingIndex >= 0) {
      // Nếu đã có ngày này, mở picker để thêm slot
      setShowSlotPicker(true);
    } else {
      // Thêm ngày mới
      setShowSlotPicker(true);
    }
  };

  const handleSlotsSelected = (slots) => {
    const slotIds = slots.map((s) => s.id);
    const existingIndex = unavailableDates.findIndex(
      (d) => d.date === currentDate
    );

    if (existingIndex >= 0) {
      // Cập nhật ngày đã có
      const updated = [...unavailableDates];
      updated[existingIndex] = {
        date: currentDate,
        slotId: slotIds,
        slots: slots, // Lưu thông tin slot để hiển thị
      };
      setUnavailableDates(updated);
    } else {
      // Thêm ngày mới
      setUnavailableDates([
        ...unavailableDates,
        {
          date: currentDate,
          slotId: slotIds,
          slots: slots,
        },
      ]);
    }
    setCurrentDate("");
  };

  const handleRemoveDate = (dateToRemove) => {
    setUnavailableDates(
      unavailableDates.filter((d) => d.date !== dateToRemove)
    );
  };

  const handleSave = () => {
    // ✅ Lưu cả date, slotId VÀ slots để hiển thị chi tiết
    const dataToSave = unavailableDates.map((d) => ({
      date: d.date,
      slotId: d.slotId,
      slots: d.slots, // ✅ Thêm slots để hiển thị tên ca thi
    }));
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-6 w-6 text-red-600" />
              Lịch bận - {proctor?.name}
            </DialogTitle>
            <DialogDescription>
              Thêm ngày và ca thi mà giảng viên không thể coi thi
            </DialogDescription>
          </DialogHeader>

          {/* Add Date Form */}
          <div className="flex gap-2 pb-4 border-b">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Button
              onClick={handleAddDate}
              disabled={!currentDate}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm ca bận
            </Button>
          </div>

          {/* List of Unavailable Dates */}
          <div className="flex-1 overflow-auto space-y-3">
            {unavailableDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có lịch bận nào</p>
                <p className="text-xs mt-1">
                  Chọn ngày và thêm ca thi bận bên trên
                </p>
              </div>
            ) : (
              unavailableDates.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {new Date(item.date).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.slotId?.length || 0} ca thi bận
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDate(item.date)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Display selected slots */}
                  <div className="flex flex-wrap gap-2">
                    {item.slots?.map((slot) => (
                      <Badge
                        key={slot.id}
                        variant="outline"
                        className="bg-white border-red-300"
                      >
                        {slot.slotName} ({slot.startTime} - {slot.endTime})
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Lưu lịch bận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Slot Picker Modal */}
      <ExamSlotPickerModal
        open={showSlotPicker}
        onOpenChange={setShowSlotPicker}
        multiSelect={true}
        selectedSlots={
          unavailableDates.find((d) => d.date === currentDate)?.slots || []
        }
        onSelect={handleSlotsSelected}
      />
    </>
  );
}
