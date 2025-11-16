import { Calendar, Eye, Users2, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

// Exam Card Component
const ExamCard = ({ exam, onViewDetail, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {exam?.courseName}
              </h4>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700 font-medium">
                {exam?.slot.startTime}- {exam.slot.endTime}
              </span>
            </div>
            <div className="flex items-center py-1 text-sm">
              <Users2 className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700 ">
                <span className="font-medium">
                  {exam?.examGroup.expected_student_count}
                </span>{" "}
                SV{" "}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-500">Phòng:</span>
              <span className="text-gray-900 font-medium">
                {exam?.room.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(exam.id)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(exam)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete && onDelete(exam.id)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ExamCard;
