import { Calendar, Clock, MapPin, Users2, Eye, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

// Timetable Exam Card - Giống ExamCard format
const TimetableExamCard = ({ exam, onViewDetail, onEdit, onDelete }) => {
  const getColorClass = (code) => {
    const colors = [
      {
        border: "border-blue-300",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      },
      {
        border: "border-purple-300",
        bg: "bg-purple-50",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      },
      {
        border: "border-green-300",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      },
      {
        border: "border-orange-300",
        bg: "bg-orange-50",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      },
      {
        border: "border-pink-300",
        bg: "bg-pink-50",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      },
    ];
    const hash = code
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getColorClass(exam.courseCode || exam.examId);

  return (
    <div
      className={`rounded-lg border ${colorClass.border} ${colorClass.bg} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-3">
        {/* Header: Course name & Student count */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Calendar
                className={`h-3.5 w-3.5 ${colorClass.text} flex-shrink-0`}
              />
              <p
                className={`font-bold text-sm ${colorClass.text} truncate`}
                title={exam.courseName}
              >
                {exam.courseName}
              </p>
            </div>
            <p
              className="text-xs text-gray-600 truncate"
              title={exam.courseCode}
            >
              Mã: {exam.courseCode}
            </p>
          </div>
          <Badge className={`${colorClass.badge} text-xs flex-shrink-0`}>
            <Users2 className="h-3 w-3 mr-1" />
            {exam.studentCount}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{exam.time}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{exam.roomName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* <UserCheck className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" /> */}
            <span className="text-gray-600 truncate" title={exam.proctorName}>
              {exam.proctorName}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(exam.examId)}
            className="flex-1 h-7 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Chi tiết
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(exam)}
            className="flex-1 h-7 text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete && onDelete(exam.examId)}
            className="flex-1 h-7 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};
export default TimetableExamCard;
