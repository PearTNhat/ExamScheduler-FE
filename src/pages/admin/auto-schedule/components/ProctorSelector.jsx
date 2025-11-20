import { useState } from "react";
import { Users, Edit, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import ProctorPickerModal from "~/pages/admin/components/ProctorPickerModal";
import UnavailableDatesModal from "./UnavailableDatesModal"; // ✅ THÊM

const ProctorSelector = ({ selectedProctors, onProctorsChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false); // ✅ THÊM
  const [selectedProctor, setSelectedProctor] = useState(null); // ✅ THÊM

  const handleConfirm = (proctors) => {
    onProctorsChange(proctors);
    setShowModal(false);
  };

  // ✅ THÊM: Xử lý mở modal lịch bận
  const handleOpenUnavailable = (proctor) => {
    setSelectedProctor(proctor);
    setShowUnavailableModal(true);
  };

  // ✅ THÊM: Lưu lịch bận cho giảng viên
  const handleSaveUnavailable = (unavailableDates) => {
    const updatedProctors = selectedProctors.map((p) =>
      p.proctorId === selectedProctor.proctorId
        ? { ...p, unavailable_dates: unavailableDates }
        : p
    );
    onProctorsChange(updatedProctors);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chọn giám thị
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {selectedProctors.length === 0 ? "Chọn giám thị" : "Chỉnh sửa"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedProctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa chọn giám thị nào</p>
              <p className="text-xs mt-1">Click "Chọn giám thị" để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Đã chọn {selectedProctors.length} giám thị:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {selectedProctors.map((proctor) => (
                  <div
                    key={proctor.proctorId}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium">
                            {proctor.lecturerCode || `GV#${proctor.proctorId}`}
                          </div>
                          {proctor.name && (
                            <div className="text-xs text-gray-600">
                              {proctor.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        Giám thị
                      </Badge>
                    </div>

                    {/* ✅ THÊM: Nút cấu hình lịch bận */}
                    <div className="pt-2 border-t border-green-200 space-y-2">
                      {proctor.unavailable_dates?.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <AlertCircle className="h-3 w-3 text-amber-600" />
                            <span className="text-amber-600 font-medium">
                              {proctor.unavailable_dates.length} ngày bận:
                            </span>
                          </div>
                          {/* Hiển thị chi tiết lịch bận */}
                          <div className="ml-4 space-y-1 text-xs text-gray-600">
                            {proctor.unavailable_dates.map((item, idx) => (
                              <div key={idx} className="flex flex-wrap gap-1">
                                <span className="font-medium">
                                  {new Date(item.date).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                  :
                                </span>
                                <span className="text-amber-700">
                                  {item.slots
                                    ?.map((s) => s.slotName)
                                    .join(", ") ||
                                    `${item.slotId?.length || 0} ca`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-500">
                            Chưa có lịch bận
                          </span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenUnavailable(proctor)}
                        className="h-7 text-xs w-full"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {proctor.unavailable_dates?.length > 0
                          ? "Chỉnh sửa lịch bận"
                          : "Thêm lịch bận"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ProctorPickerModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleConfirm}
        selectedProctors={selectedProctors}
      />

      {/* ✅ THÊM: Modal lịch bận */}
      <UnavailableDatesModal
        open={showUnavailableModal}
        onOpenChange={setShowUnavailableModal}
        proctor={selectedProctor}
        onSave={handleSaveUnavailable}
      />
    </>
  );
};

export default ProctorSelector;
