import { useState } from "react";
import { Building2, Edit, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import RoomPickerModal from "./RoomPickerModal";

const RoomSelector = ({ selectedRooms, onRoomsChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = (rooms) => {
    onRoomsChange(rooms);
    setShowModal(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Chọn phòng thi
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {selectedRooms.length === 0 ? "Chọn phòng" : "Chỉnh sửa"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa chọn phòng nào</p>
              <p className="text-xs mt-1">Click "Chọn phòng" để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Đã chọn {selectedRooms.length} phòng:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {selectedRooms.map((room) => (
                  <div
                    key={room.roomId}
                    className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{room.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {room.capacity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {room.location}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <RoomPickerModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleConfirm}
        selectedRooms={selectedRooms}
      />
    </>
  );
};

export default RoomSelector;
