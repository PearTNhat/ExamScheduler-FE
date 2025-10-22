import {
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users2,
  BookOpen,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const ExamListView = ({ exams, loading, onView, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-50 hover:to-blue-100/50">
            <TableHead className="font-semibold text-blue-900">
              Nhóm thi
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Học phần
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Ngày thi
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Ca thi
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Phòng thi
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Đợt thi
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Trạng thái
            </TableHead>
            <TableHead className="text-right font-semibold text-blue-900">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
                  <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : exams.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-gray-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="h-12 w-12 text-gray-300" />
                  <p className="font-medium">Chưa có lịch thi nào</p>
                  <p className="text-sm">
                    Nhấn "Thêm lịch thi" để tạo lịch thi mới
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            exams.map((exam) => (
              <TableRow
                key={exam.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <TableCell className="font-medium">
                  <Badge variant="outline" className="font-mono">
                    {exam.examGroup?.code || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {exam.examGroup?.course?.codeCourse || "N/A"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-500">
                      {formatDate(exam?.examDate) || ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {exam.examSlot?.slotName || "N/A"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {exam.room?.code || "N/A"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">
                      {exam.examGroup?.examSession?.name || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(exam.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(exam)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(exam)}
                      className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(exam)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamListView;
