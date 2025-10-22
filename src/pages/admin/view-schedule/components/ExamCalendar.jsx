import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

const ExamCalendar = ({ exams, onEventClick, onDateClick }) => {
  const calendarRef = useRef(null);

  // Chuyển đổi dữ liệu exams thành events cho FullCalendar
  const events = exams.map((exam) => ({
    id: exam.id.toString(),
    title: `${exam.exam_group?.course?.name || "N/A"} - ${
      exam.room?.code || "N/A"
    }`,
    start: exam.exam_date,
    allDay: true,
    extendedProps: {
      examGroupCode: exam.exam_group?.code,
      roomCode: exam.room?.code,
      slotName: exam.slot?.slot_name,
      startTime: exam.slot?.start_time,
      endTime: exam.slot?.end_time,
      location: exam.room?.location?.name,
      studentCount: exam.exam_group?.expected_student_count,
      status: exam.status,
      sessionName: exam.exam_group?.session?.name,
    },
    backgroundColor:
      exam.status === "oke"
        ? "#10b981"
        : exam.status === "failed"
        ? "#ef4444"
        : "#3b82f6",
    borderColor:
      exam.status === "oke"
        ? "#059669"
        : exam.status === "failed"
        ? "#dc2626"
        : "#2563eb",
  }));

  const handleEventClick = (clickInfo) => {
    const examId = parseInt(clickInfo.event.id);
    const exam = exams.find((e) => e.id === examId);
    if (exam && onEventClick) {
      onEventClick(exam);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="px-1 py-0.5 text-xs overflow-hidden">
        <div className="font-semibold truncate">{eventInfo.event.title}</div>
        <div className="text-white/90 truncate">
          {eventInfo.event.extendedProps.slotName} (
          {eventInfo.event.extendedProps.startTime} -{" "}
          {eventInfo.event.extendedProps.endTime})
        </div>
        <div className="text-white/80 truncate">
          {eventInfo.event.extendedProps.sessionName}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={viLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Hôm nay",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={onDateClick}
        eventContent={renderEventContent}
        height="auto"
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventDisplay="block"
        displayEventTime={false}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
      />

      {/* Custom CSS for FullCalendar */}
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #1f2937;
        }
        .fc-button {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
          text-transform: capitalize !important;
          font-weight: 500 !important;
          padding: 0.5rem 1rem !important;
        }
        .fc-button:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
        .fc-button-active {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        }
        .fc-daygrid-day-number {
          font-weight: 600;
          color: #374151;
        }
        .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #6b7280;
        }
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
          margin: 1px 0;
        }
        .fc-event:hover {
          opacity: 0.9;
        }
        .fc-daygrid-day-frame {
          min-height: 100px;
        }
        .fc-scrollgrid {
          border-color: #e5e7eb !important;
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
};

export default ExamCalendar;
