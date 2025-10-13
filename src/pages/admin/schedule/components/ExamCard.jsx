import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Clock, User, Users, BookOpen } from "lucide-react";
import { Badge } from "~/components/ui/badge";

function ExamCard({ exam, allSubjects = [] }) {
  // Tìm thông tin môn học từ danh sách subjects
  const subjectInfo = allSubjects.find((s) => s.subjectId === exam.subject);
  const subjectName = subjectInfo?.subjectName || exam.subject;
  const duration = subjectInfo?.duration || 90;

  // Màu sắc ngẫu nhiên cho card (dựa vào mã môn học)
  const getColorClass = (subjectId) => {
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
      {
        border: "border-indigo-300",
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        badge: "bg-indigo-100 text-indigo-700",
      },
    ];
    const hash = subjectId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getColorClass(exam.subject);

  return (
    <div
      className={`rounded-lg border-2 ${colorClass.border} ${colorClass.bg} shadow-md hover:shadow-lg transition-shadow mb-2 overflow-hidden`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen
                className={`h-4 w-4 ${colorClass.text} flex-shrink-0`}
              />
              <p
                className={`font-bold text-sm ${colorClass.text} truncate`}
                title={exam.subject}
              >
                {exam.subject}
              </p>
            </div>
            <p
              className="text-xs text-gray-600 line-clamp-2"
              title={subjectName}
            >
              {subjectName}
            </p>
          </div>
          <Badge className={`${colorClass.badge} text-xs flex-shrink-0`}>
            <Users className="h-3 w-3 mr-1" />
            {exam.studentCount}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span className="font-medium">{exam.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">•</span>
            <span>{duration} phút</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <User className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-gray-600">
            <span className="font-medium text-gray-700">GT:</span>{" "}
            {exam.proctor}
          </span>
        </div>
      </div>

      {/* Accordion for Students */}
      <Accordion.Root type="single" collapsible className="w-full">
        <Accordion.Item value="students">
          <Accordion.Header>
            <Accordion.Trigger className="w-full px-3 py-2 flex justify-between items-center text-xs font-semibold hover:bg-white/50 transition-colors group">
              <span className={`${colorClass.text} flex items-center gap-1`}>
                <Users className="h-3.5 w-3.5" />
                Danh sách sinh viên ({exam.studentCount})
              </span>
              <ChevronDown
                className={`h-4 w-4 ${colorClass.text} transition-transform duration-200 group-data-[state=open]:rotate-180`}
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="px-3 pb-3">
              <div className="max-h-32 overflow-y-auto rounded border border-gray-200 bg-white p-2">
                <ul className="space-y-1">
                  {exam.students.map((studentId, index) => (
                    <li
                      key={studentId}
                      className="text-xs text-gray-700 flex items-center gap-2 py-0.5"
                    >
                      <span className="text-gray-400 font-mono text-[10px] w-5">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="font-medium">{studentId}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}

export default ExamCard;
