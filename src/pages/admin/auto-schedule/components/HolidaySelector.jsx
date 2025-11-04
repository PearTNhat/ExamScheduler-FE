import { useState } from "react";
import { Calendar, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const HolidaySelector = ({ holidays, onHolidaysChange }) => {
  const [newHoliday, setNewHoliday] = useState("");

  const handleAddHoliday = () => {
    if (newHoliday && !holidays.includes(newHoliday)) {
      onHolidaysChange([...holidays, newHoliday]);
      setNewHoliday("");
    }
  };

  const handleRemoveHoliday = (holidayToRemove) => {
    onHolidaysChange(holidays.filter((h) => h !== holidayToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddHoliday();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Chọn ngày lễ / ngày nghỉ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Holiday Input */}
        <div className="flex gap-2">
          <Input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Chọn ngày lễ..."
          />
          <Button
            onClick={handleAddHoliday}
            disabled={!newHoliday || holidays.includes(newHoliday)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Holidays List */}
        {holidays.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Chưa có ngày lễ nào được chọn
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Danh sách ngày lễ ({holidays.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {holidays.sort().map((holiday) => (
                <Badge
                  key={holiday}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5"
                >
                  <Calendar className="h-3 w-3" />
                  {new Date(holiday).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <button
                    onClick={() => handleRemoveHoliday(holiday)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Các ngày lễ sẽ không được xếp lịch thi
        </div>
      </CardContent>
    </Card>
  );
};

export default HolidaySelector;
