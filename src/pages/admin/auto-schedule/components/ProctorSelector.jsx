import { useState } from "react";
import { Users, Edit, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import ProctorPickerModal from "./ProctorPickerModal";

const ProctorSelector = ({ selectedProctors, onProctorsChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = (proctors) => {
    onProctorsChange(proctors);
    setShowModal(false);
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
                    className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg"
                  >
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
    </>
  );
};

export default ProctorSelector;
