import { Settings2, CalendarX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import HolidaySelector from "./HolidaySelector";

const ConstraintsConfiguration = ({
  constraints = [],
  onConstraintsChange,
}) => {
  // Helper để tìm constraint theo code
  const getConstraint = (code) => {
    return constraints.find((c) => c.constraintCode === code);
  };

  // Helper để cập nhật constraint
  const updateConstraint = (code, rule) => {
    const newConstraints = [...constraints];
    const existingIndex = newConstraints.findIndex(
      (c) => c.constraintCode === code
    );

    if (existingIndex >= 0) {
      // Update existing constraint
      newConstraints[existingIndex] = {
        constraintCode: code,
        rule: rule,
      };
    } else {
      // Add new constraint
      newConstraints.push({
        constraintCode: code,
        rule: rule,
      });
    }

    onConstraintsChange(newConstraints);
  };
  const avoidWeekend = getConstraint("AVOID_WEEKEND");
  const avoidWeekendEnabled = avoidWeekend?.rule?.avoid_weekend || false;
  const handleAvoidWeekendChange = (enabled) => {
    if (enabled) {
      updateConstraint("AVOID_WEEKEND", { avoid_weekend: true });
    } else {
      removeConstraint("AVOID_WEEKEND");
    }
  };
  // Helper để xóa constraint
  const removeConstraint = (code) => {
    const newConstraints = constraints.filter((c) => c.constraintCode !== code);
    onConstraintsChange(newConstraints);
  };

  // Handle holiday constraint
  const holidayConstraint = getConstraint("HOLIDAY");
  const holidays = holidayConstraint?.rule?.holiday || [];

  const handleHolidaysChange = (newHolidays) => {
    if (newHolidays.length > 0) {
      updateConstraint("HOLIDAY", { holiday: newHolidays });
    } else {
      removeConstraint("HOLIDAY");
    }
  };

  // Handle max exams per day
  const maxExamsConstraint = getConstraint("MAX_EXAMS_PER_DAY");
  const maxExamsPerDay = maxExamsConstraint?.rule?.max_exam_per_day || 0;

  const handleMaxExamsChange = (value) => {
    if (value > 0) {
      updateConstraint("MAX_EXAMS_PER_DAY", { max_exam_per_day: value });
    } else {
      removeConstraint("MAX_EXAMS_PER_DAY");
    }
  };

  // Handle room location limit
  const roomLocationConstraint = getConstraint("ROOM_LOCATION_LIMIT");
  const roomLocationLimit = roomLocationConstraint?.rule?.max_location || 0;

  const handleRoomLocationChange = (value) => {
    if (value > 0) {
      updateConstraint("ROOM_LOCATION_LIMIT", { max_location: value });
    } else {
      removeConstraint("ROOM_LOCATION_LIMIT");
    }
  };

  // ✅ THÊM: Handler cho LECTURER_LOCATION_MOVEMENT
  const lecturerLocationConstraint = getConstraint(
    "LECTURER_LOCATION_MOVEMENT"
  );
  const lecturerLocationEnabled =
    lecturerLocationConstraint?.rule?.enabled || false;

  const handleLecturerLocationChange = (enabled) => {
    if (enabled) {
      updateConstraint("LECTURER_LOCATION_MOVEMENT", { enabled: true });
    } else {
      removeConstraint("LECTURER_LOCATION_MOVEMENT");
    }
  };

  // ✅ THÊM: Handler cho MAX_EXAMS_PER_LECTURER
  const maxExamsPerLecturerConstraint = getConstraint("MAX_EXAMS_PER_LECTURER");
  const maxExamsPerLecturer =
    maxExamsPerLecturerConstraint?.rule?.max_exams_per_lecturer || 0;

  const handleMaxExamsPerLecturerChange = (value) => {
    if (value > 0) {
      updateConstraint("MAX_EXAMS_PER_LECTURER", {
        max_exams_per_lecturer: value,
      });
    } else {
      removeConstraint("MAX_EXAMS_PER_LECTURER");
    }
  };

  const maxSlotsPerCourseConstraint = getConstraint("MAX_SLOTS_PER_COURSE");
  const maxSlotsPerCourse =
    maxSlotsPerCourseConstraint?.rule?.max_slots_per_course || 0;

  const handleMaxSlotsPerCourseChange = (value) => {
    if (value > 0) {
      updateConstraint("MAX_SLOTS_PER_COURSE", {
        max_slots_per_course: value,
      });
    } else {
      removeConstraint("MAX_SLOTS_PER_COURSE");
    }
  };

  const constraintsList = [
    {
      code: "AVOID_WEEKEND",
      name: "Tránh thi cuối tuần",
      description: "Không lên lịch thi vào  Chủ Nhật",
      type: "CỨNG",
      hasParam: false,
      paramLabel: "Không thi vào chủ nhật",
      value: avoidWeekendEnabled,
      isEnabled: avoidWeekendEnabled,
      onChange: handleAvoidWeekendChange,
    },
    {
      code: "MAX_EXAMS_PER_DAY",
      name: "Giới hạn số ca thi/ngày",
      description: "Sinh viên không thi quá X ca trong 1 ngày",
      type: "MỀM",
      hasParam: true,
      paramType: "number",
      paramLabel: "Số ca thi tối đa:",
      value: maxExamsPerDay,
      isEnabled: maxExamsPerDay > 0,
      onChange: handleMaxExamsChange,
    },
    {
      code: "ROOM_LOCATION_LIMIT",
      name: "Giới hạn cơ sở/ngày (Sinh viên)",
      description:
        "Giới hạn số lượng cơ sở tối đa mà sinh viên có thể thi trong cùng một ngày",
      type: "MỀM",
      hasParam: true,
      paramType: "number",
      paramLabel: "Số cơ sở tối đa:",
      value: roomLocationLimit,
      isEnabled: roomLocationLimit > 0,
      onChange: handleRoomLocationChange,
    },
    // ✅ THÊM MỚI
    {
      code: "LECTURER_LOCATION_MOVEMENT",
      name: "Hạn chế di chuyển cơ sở (Giảng viên)",
      description:
        "Giảm thiểu việc giảng viên phải di chuyển giữa các cơ sở trong cùng một ngày",
      type: "MỀM",
      hasParam: false,
      value: lecturerLocationEnabled,
      isEnabled: lecturerLocationEnabled,
      onChange: handleLecturerLocationChange,
    },
    {
      code: "MAX_EXAMS_PER_LECTURER",
      name: "Giới hạn số môn thi/giảng viên",
      description: "Mỗi giảng viên chỉ được phân công tối đa X môn thi",
      type: "MỀM",
      hasParam: true,
      paramType: "number",
      paramLabel: "Số môn thi tối đa:",
      value: maxExamsPerLecturer,
      isEnabled: maxExamsPerLecturer > 0,
      onChange: handleMaxExamsPerLecturerChange,
    },
    {
      code: "MAX_SLOTS_PER_COURSE",
      name: "Giới hạn số ca thi/môn học",
      description:
        "Giới hạn số ca thi khác nhau cho cùng một môn học (giảm số mã đề cần ra)",
      type: "MỀM",
      hasParam: true,
      paramType: "number",
      paramLabel: "Số ca tối đa:",
      value: maxSlotsPerCourse,
      isEnabled: maxSlotsPerCourse > 0,
      onChange: handleMaxSlotsPerCourseChange,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Cấu hình ràng buộc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Holiday Constraint */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CalendarX className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Ngày nghỉ lễ</h4>
              <p className="text-sm text-gray-600">Không thi vào các ngày lễ</p>
            </div>
            <Badge variant="destructive" className="text-xs">
              CỨNG
            </Badge>
          </div>

          <div className="ml-8">
            <HolidaySelector
              holidays={holidays}
              onHolidaysChange={handleHolidaysChange}
            />
          </div>
        </div>

        {/* Other Constraints */}
        {constraintsList.map((constraint) => (
          <div
            key={constraint.code}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            {/* Constraint Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  id={constraint.code}
                  checked={constraint.isEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      constraint.onChange(constraint.hasParam ? 1 : true);
                    } else {
                      constraint.onChange(0);
                    }
                  }}
                />
                <div className="flex-1">
                  <label
                    htmlFor={constraint.code}
                    className="font-medium text-gray-900 cursor-pointer block"
                  >
                    {constraint.name}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {constraint.description}
                  </p>
                </div>
              </div>

              {/* Type Badge */}
              <Badge
                variant={
                  constraint.type === "CỨNG" ? "destructive" : "secondary"
                }
                className={`text-xs ${
                  constraint.type === "CỨNG"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {constraint.type}
              </Badge>
            </div>

            {/* Constraint Parameters */}
            {constraint.isEnabled && constraint.hasParam && (
              <div className="ml-7 pt-2 border-t border-gray-100">
                <Label
                  htmlFor={`${constraint.code}-param`}
                  className="text-sm font-medium text-gray-700"
                >
                  {constraint.paramLabel}
                </Label>
                <Input
                  id={`${constraint.code}-param`}
                  type={constraint.paramType}
                  min="1"
                  max="100"
                  value={constraint.value}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    constraint.onChange(value);
                  }}
                  className="w-24 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giá trị: {constraint.value}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConstraintsConfiguration;
