import { Clock, User, Users, BookOpen, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";

// Bỏ prop `allSubjects`, component giờ chỉ cần `exam`
function ExamCard({ exam }) {
  // Lấy tất cả thông tin trực tiếp từ đối tượng `exam`
  // (Vì API response mới đã cung cấp đầy đủ)
  const {
    examGroup,
    courseCode,
    duration,
    studentCount,
    time,
    proctor,
    roomId, // Dữ liệu mới
    location, // Dữ liệu mới
  } = exam;

  // Hàm tạo màu ngẫu nhiên (không đổi)
  const getColorClass = (id) => {
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
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getColorClass(examGroup);

  return (
    // Bỏ `overflow-hidden` vì không còn accordion
    <div
      className={`rounded-lg border ${colorClass.border} ${colorClass.bg} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-3">
        {/* Hàng 1: Tên nhóm và Sĩ số */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <BookOpen
                className={`h-3.5 w-3.5 ${colorClass.text} flex-shrink-0`}
              />
              <p
                className={`font-bold text-sm ${colorClass.text} truncate`}
                title={examGroup}
              >
                {examGroup}
              </p>
            </div>
            <p className="text-xs text-gray-600 truncate" title={courseCode}>
              Môn: {courseCode}
            </p>
          </div>
          <Badge className={`${colorClass.badge} text-xs flex-shrink-0`}>
            <Users className="h-3 w-3 mr-1" />
            {studentCount}
          </Badge>
        </div>

        {/* Hàng 2: Thông tin chi tiết */}
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{time}</span>
            <span className="text-gray-400">•</span>
            <span>{duration} phút</span>
          </div>

          {/* Thêm hiển thị phòng thi và địa điểm */}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-600">
              <span className="font-medium text-gray-700">{roomId}</span>
              <span className="text-gray-500"> ({location})</span>
            </span>
          </div>

          {/* Hiển thị giám thị */}
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-600">
              <span className="font-medium text-gray-700">GT:</span> {proctor}
            </span>
          </div>
        </div>
      </div>

      {/* Không còn Accordion danh sách sinh viên */}
    </div>
  );
}

export default ExamCard;
