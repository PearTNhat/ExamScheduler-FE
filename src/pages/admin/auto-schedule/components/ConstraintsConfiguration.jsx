import { Settings2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ConstraintsConfiguration = ({ constraints, onConstraintsChange }) => {
  const handleToggleConstraint = (code) => {
    onConstraintsChange({
      ...constraints,
      [code]: {
        ...constraints[code],
        value:
          code === "maxExamsPerStudentPerDay"
            ? constraints[code]?.value > 0 // Nếu đang > 0 thì tắt (đặt về 0)
              ? 0
              : 2 // Nếu đang tắt (0) thì bật (đặt về 2)
            : !constraints[code]?.value, // Toggle boolean
      },
    });
  };

  const handleUpdateValue = (code, value) => {
    onConstraintsChange({
      ...constraints,
      [code]: {
        ...constraints[code],
        value: value,
      },
    });
  };

  const handleUpdateType = (code, type) => {
    onConstraintsChange({
      ...constraints,
      [code]: {
        ...constraints[code],
        type: type,
      },
    });
  };

  const constraintsList = [
    {
      code: "maxExamsPerStudentPerDay",
      name: "Giới hạn số ca thi/ngày",
      description: "Sinh viên không thi quá X ca trong 1 ngày (0 = tắt)",
      hasParam: true,
      paramType: "number",
      paramLabel: "Số ca thi tối đa:",
      defaultValue: 2,
    },
    {
      code: "avoidInterLocationTravel",
      name: "Không di chuyển cơ sở",
      description:
        "Sinh viên không phải di chuyển giữa các cơ sở trong cùng ngày",
      hasParam: false,
      defaultValue: true,
    },
    {
      code: "avoid_weekend", // <-- ĐÃ THÊM
      name: "Tránh xếp lịch cuối tuần",
      description: "Không xếp lịch thi vào ngày thứ 7 hoặc Chủ Nhật",
      hasParam: false,
      defaultValue: true,
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
      <CardContent className="space-y-4">
        {constraintsList.map((constraint) => {
          const currentConstraint = constraints[constraint.code] || {
            value: constraint.defaultValue,
            type: "Hard",
          };
          const isEnabled =
            constraint.code === "maxExamsPerStudentPerDay"
              ? currentConstraint.value > 0
              : currentConstraint.value === true;

          return (
            <div
              key={constraint.code}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              {/* Constraint Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    id={constraint.code}
                    checked={isEnabled}
                    onCheckedChange={() =>
                      handleToggleConstraint(constraint.code)
                    }
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

                {/* Type Badge/Selector */}
                <Select
                  value={currentConstraint.type}
                  onValueChange={(value) =>
                    handleUpdateType(constraint.code, value)
                  }
                  disabled={!isEnabled}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue>
                      {currentConstraint.type === "Hard" ? (
                        <Badge variant="destructive" className="text-xs">
                          Hard
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-yellow-100 text-yellow-800"
                        >
                          Soft
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Soft">Soft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Constraint Parameters */}
              {isEnabled && constraint.hasParam && (
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
                    min="0"
                    max="5"
                    value={currentConstraint.value}
                    onChange={(e) =>
                      handleUpdateValue(
                        constraint.code,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-24 mt-1"
                  />
                  {currentConstraint.value === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ràng buộc này đang tắt
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Info Panel */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <div className="font-medium">Loại ràng buộc:</div>
            <ul className="mt-1 space-y-1">
              <li>
                • <strong>Hard</strong>: Bắt buộc phải thỏa mãn
              </li>
              <li>
                • <strong>Soft</strong>: Sẽ được tối ưu hóa nhưng có thể vi phạm
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstraintsConfiguration;
