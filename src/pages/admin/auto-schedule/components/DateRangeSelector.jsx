import { CalendarRange } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5" />
          Thời gian xếp lịch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Ngày bắt đầu</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end-date">Ngày kết thúc</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate}
            />
          </div>
        </div>

        {/* Date Range Info */}
        {startDate && endDate && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Khoảng thời gian:</span>{" "}
              {Math.ceil(
                (new Date(endDate) - new Date(startDate)) /
                  (1000 * 60 * 60 * 24)
              ) + 1}{" "}
              ngày
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Từ {new Date(startDate).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(endDate).toLocaleDateString("vi-VN")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;
