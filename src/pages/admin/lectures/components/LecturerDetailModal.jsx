import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Hash,
  Users,
  Loader2,
} from "lucide-react";
import { formatDate } from "~/utils/date";

export default function LecturerDetailModal({
  open,
  onOpenChange,
  lecturer,
  loading,
}) {
  // Loading state
  if (!lecturer && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">
              Đang tải thông tin giảng viên...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!lecturer) return null;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    iconColor = "text-gray-500",
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-base text-gray-900 break-words">
          {value || "Chưa có thông tin"}
        </p>
      </div>
    </div>
  );

  const genderMap = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {`${lecturer.firstName || ""} ${
                  lecturer.lastName || ""
                }`.trim() || "Giảng viên"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {lecturer.lecturerCode}
                </Badge>
                <span className="text-gray-500">•</span>
                <span>ID: {lecturer.id}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin cá nhân */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Thông tin cá nhân
            </h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <InfoRow
                icon={User}
                label="Họ"
                value={lecturer.firstName}
                iconColor="text-indigo-600"
              />
              <InfoRow
                icon={User}
                label="Tên"
                value={lecturer.lastName}
                iconColor="text-indigo-600"
              />
              <InfoRow
                icon={Hash}
                label="Mã giảng viên"
                value={lecturer.lecturerCode}
                iconColor="text-purple-600"
              />
              <InfoRow
                icon={Users}
                label="Giới tính"
                value={genderMap[lecturer.gender] || lecturer.gender}
                iconColor="text-blue-600"
              />
              <InfoRow
                icon={Calendar}
                label="Ngày sinh"
                value={
                  lecturer.dateOfBirth ? formatDate(lecturer.dateOfBirth) : null
                }
                iconColor="text-green-600"
              />
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Thông tin liên hệ
            </h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <InfoRow
                icon={Mail}
                label="Email"
                value={lecturer.user?.email || lecturer.email}
                iconColor="text-red-600"
              />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={lecturer.phoneNumber}
                iconColor="text-orange-600"
              />
              <InfoRow
                icon={MapPin}
                label="Địa chỉ"
                value={lecturer.address}
                iconColor="text-pink-600"
              />
            </div>
          </div>

          {/* Thông tin công việc */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Thông tin công việc
            </h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <InfoRow
                icon={Building2}
                label="Khoa"
                value={lecturer.department?.departmentName}
                iconColor="text-cyan-600"
              />
              <InfoRow
                icon={Calendar}
                label="Ngày tạo"
                value={formatDate(lecturer.createdAt)}
                iconColor="text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Footer với thống kê */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Cập nhật lần cuối:</span>{" "}
            {lecturer.updatedAt ? formatDate(lecturer.updatedAt) : "Chưa có"}
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Hoạt động
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
