import {
  Calendar,
  Clock,
  MapPin,
  Users2,
  BookOpen,
  FileText,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";

const ExamDetailModal = ({ open, onOpenChange, exam }) => {
  if (!exam) return null;

  const InfoRow = ({ icon: Icon, label, value, iconColor }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-base text-gray-900 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "oke") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          OK
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-6 w-6 text-blue-600" />
            Chi tiết lịch thi
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Thông tin ca thi */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Thông tin ca thi
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={Calendar}
                label="Ngày thi"
                value={formatDate(exam.exam_date)}
                iconColor="bg-blue-600"
              />
              <InfoRow
                icon={Clock}
                label="Ca thi"
                value={
                  exam.slot
                    ? `${exam.slot.slot_name} (${exam.slot.start_time} - ${exam.slot.end_time})`
                    : "N/A"
                }
                iconColor="bg-purple-600"
              />
              <InfoRow
                icon={Clock}
                label="Thời lượng"
                value={exam.duration ? `${exam.duration} phút` : "N/A"}
                iconColor="bg-indigo-600"
              />
              <div className="flex items-start gap-3 py-3">
                <div className="p-2 rounded-lg bg-teal-600">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Trạng thái
                  </p>
                  <div>{getStatusBadge(exam.status)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin phòng thi */}
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Thông tin phòng thi
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={MapPin}
                label="Phòng thi"
                value={exam.room?.code || "N/A"}
                iconColor="bg-green-600"
              />
              <InfoRow
                icon={MapPin}
                label="Địa điểm"
                value={exam.room?.location?.name || "N/A"}
                iconColor="bg-emerald-600"
              />
              <InfoRow
                icon={Users2}
                label="Sức chứa"
                value={exam.room?.capacity || "N/A"}
                iconColor="bg-teal-600"
              />
            </div>
          </div>

          {/* Thông tin nhóm thi */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              Thông tin nhóm thi
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={FileText}
                label="Mã nhóm thi"
                value={exam.exam_group?.code || "N/A"}
                iconColor="bg-amber-600"
              />
              <InfoRow
                icon={BookOpen}
                label="Học phần"
                value={exam.exam_group?.course?.name || "N/A"}
                iconColor="bg-blue-600"
              />
              <InfoRow
                icon={FileText}
                label="Mã học phần"
                value={exam.exam_group?.course?.code || "N/A"}
                iconColor="bg-indigo-600"
              />
              <InfoRow
                icon={Users2}
                label="Số SV dự kiến"
                value={exam.exam_group?.expected_student_count || "N/A"}
                iconColor="bg-orange-600"
              />
              <InfoRow
                icon={Calendar}
                label="Đợt thi"
                value={exam.exam_group?.session?.name || "N/A"}
                iconColor="bg-purple-600"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamDetailModal;
