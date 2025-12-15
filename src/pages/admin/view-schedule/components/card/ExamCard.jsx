import { Calendar, Eye, Users2, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

// Exam Card Component
const ExamCard = ({ exam, onViewDetail, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        {/* Course name */}
        <h4 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2">
          {exam?.courseName}
        </h4>

        {/* Time and Room info */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 text-gray-700">
            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="font-medium">
              {exam?.slot.startTime} - {exam.slot.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users2 className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">
              <span className="font-medium">{exam?.studentCount}</span> SV
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span>Phòng:</span>
            <span className="text-gray-900 font-medium">
              {exam?.room.code} ({exam?.room.capacity})
            </span>
          </div>
        </div>

        {/* Action buttons - Compact horizontal layout */}
        <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetail(exam.examId)}
            className="h-7 w-7 p-0 hover:bg-blue-50"
            title="Xem chi tiết"
          >
            <Eye className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(exam)}
            className="h-7 w-7 p-0 hover:bg-green-50"
            title="Sửa"
          >
            <Calendar className="h-3.5 w-3.5 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete && onDelete(exam.examId)}
            className="h-7 w-7 p-0 hover:bg-red-50"
            title="Xóa"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ExamCard;
