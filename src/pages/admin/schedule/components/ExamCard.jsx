import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

function ExamCard({ exam }) {
  return (
    <div className="text-xs rounded-md border bg-white shadow-sm mb-1 p-2">
      <p className="font-bold text-sm text-gray-900">{exam.subject}</p>
      <p className="text-gray-600">{exam.time}</p>
      <p className="text-gray-800">GT: {exam.proctor}</p>

      {/* Bắt đầu với Accordion.Root */}
      <Accordion.Root type="single" collapsible className="w-full">
        <Accordion.Item value="students" className="border-t mt-1 pt-1">
          <Accordion.Header>
            {/* Sử dụng Accordion.Trigger */}
            <Accordion.Trigger className="text-xs w-full flex justify-between items-center font-semibold hover:underline group">
              <span>SV ({exam.studentCount})</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>

          {/* Sử dụng Accordion.Content */}
          <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="max-h-24 overflow-y-auto pr-1 pt-1">
              <ul className="list-disc list-inside">
                {exam.students.map((studentId) => (
                  <li key={studentId}>{studentId}</li>
                ))}
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
export default ExamCard;
