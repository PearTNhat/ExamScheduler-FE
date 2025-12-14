import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  UserCheck,
  Calendar,
  Building2,
  BookOpen,
} from "lucide-react";
import { formatConstraintType } from "~/utils/helper";

const ConflictCheckModal = ({ open, onOpenChange, conflicts, loading }) => {
  const [hardConflicts, setHardConflicts] = useState([]);
  const [softConflicts, setSoftConflicts] = useState([]);

  useEffect(() => {
    if (conflicts) {
      setHardConflicts(conflicts.hardConflicts || []);
      setSoftConflicts(conflicts.softConflicts || []);
    }
  }, [conflicts]);

  const getConflictIcon = (type) => {
    const iconMap = {
      ROOM_CAPACITY: Building2,
      ROOM_TYPE_MISMATCH: Building2,
      MISSING_SECOND_PROCTOR: UserCheck,
      PROCTOR_UNAVAILABLE: UserCheck,
      ROOM_CONFLICT: MapPin,
      PROCTOR_CONFLICT: Users,
      STUDENT_CONFLICT: Users,
      MAX_EXAMS_PER_DAY: Clock,
      TOO_MANY_LOCATIONS: MapPin,
      LECTURER_OVERLOAD: UserCheck,
      TOO_MANY_SLOTS_PER_COURSE: BookOpen,
      LECTURER_LOCATION_MOVEMENT: MapPin,
    };
    const Icon = iconMap[type] || AlertCircle;
    return <Icon className="h-4 w-4" />;
  };

  // Cập nhật: Thêm prop 'index'
  const ConflictItem = ({ conflict, isHard, index }) => (
    <div
      className={`p-4 rounded-lg border ${
        isHard ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Cập nhật: Hiển thị số thứ tự */}
        <div
          className={`flex items-center justify-center h-8 w-6 font-bold text-sm ${
            isHard ? "text-red-800" : "text-yellow-800"
          }`}
        >
          {index}.
        </div>

        <div
          className={`p-2 rounded-lg ${
            isHard ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {getConflictIcon(conflict.constraintType)}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {formatConstraintType(conflict.constraintType)}
              </h4>
              {conflict.description && (
                <p
                  className={`text-sm ${
                    isHard ? "text-red-700" : "text-yellow-800"
                  }`}
                >
                  {conflict.description}
                </p>
              )}
            </div>
          </div>

          {conflict.affectedExams && conflict.affectedExams.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Ca thi liên quan:
              </p>
              <div className="flex flex-wrap gap-1">
                {conflict.affectedExams.map((exam, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {exam}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Kết quả kiểm tra xung đột lịch thi
          </DialogTitle>
          <DialogDescription>
            Danh sách các xung đột cứng (HARD) và xung đột mềm (SOFT) trong lịch
            thi
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra xung đột...</p>
          </div>
        ) : (
          <div className="h-[500px] overflow-y-auto pr-4">
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-red-700 font-medium">
                        Xung đột cứng
                      </p>
                      <p className="text-2xl font-bold text-red-900">
                        {hardConflicts.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">
                        Xung đột mềm
                      </p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {softConflicts.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">
                        Trạng thái
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {hardConflicts.length === 0 ? "Đạt yêu cầu" : "Cần sửa"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hard Conflicts */}
              {hardConflicts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Xung đột cứng ({hardConflicts.length})
                  </h3>
                  <div className="space-y-3">
                    {hardConflicts.map((conflict, idx) => (
                      <ConflictItem
                        key={idx}
                        conflict={conflict}
                        isHard
                        index={idx + 1} // Cập nhật: Truyền index
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Conflicts */}
              {softConflicts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Xung đột mềm ({softConflicts.length})
                  </h3>
                  <div className="space-y-3">
                    {softConflicts.map((conflict, idx) => (
                      <ConflictItem
                        key={idx}
                        conflict={conflict}
                        index={idx + 1} // Cập nhật: Truyền index
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Conflicts */}
              {hardConflicts.length === 0 && softConflicts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không phát hiện xung đột
                  </h3>
                  <p className="text-gray-600">
                    Lịch thi đã được kiểm tra và không có xung đột nào được phát
                    hiện.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConflictCheckModal;
