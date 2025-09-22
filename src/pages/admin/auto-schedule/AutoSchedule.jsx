import { useState } from "react";
import {
  Play,
  Pause,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

const AutoSchedule = () => {
  const [selectedSession, setSelectedSession] = useState("1");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState(null);

  const [constraints, setConstraints] = useState([
    {
      id: 1,
      code: "NO_CONFLICT",
      name: "Không trùng lịch sinh viên",
      description: "Sinh viên không được thi 2 môn cùng lúc",
      type: "Cứng",
      enabled: true,
      params: {},
    },
    {
      id: 2,
      code: "MAX_EXAMS_PER_DAY",
      name: "Giới hạn số ca thi/ngày",
      description: "Sinh viên không thi quá X ca trong 1 ngày",
      type: "Mềm",
      enabled: true,
      params: { maxExams: 2 },
    },
    {
      id: 3,
      code: "NO_CAMPUS_TRAVEL",
      name: "Không di chuyển cơ sở",
      description:
        "Sinh viên không phải di chuyển giữa các cơ sở trong cùng ngày",
      type: "Mềm",
      enabled: false,
      params: {},
    },
    {
      id: 4,
      code: "ROOM_CAPACITY",
      name: "Sức chứa phòng thi",
      description: "Số sinh viên không vượt quá sức chứa phòng",
      type: "Cứng",
      enabled: true,
      params: {},
    },
  ]);

  const sessions = [
    { id: "1", name: "Cuối kỳ 2024-1", totalGroups: 25, scheduledGroups: 5 },
    { id: "2", name: "Giữa kỳ 2024-1", totalGroups: 30, scheduledGroups: 30 },
  ];

  const currentSession = sessions.find((s) => s.id === selectedSession);

  const handleToggleConstraint = (id) => {
    setConstraints(
      constraints.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleUpdateParam = (id, param, value) => {
    setConstraints(
      constraints.map((c) =>
        c.id === id ? { ...c, params: { ...c.params, [param]: value } } : c
      )
    );
  };

  const handleStartScheduling = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate scheduling process
    const steps = [
      "Khởi tạo thuật toán...",
      "Đọc dữ liệu nhóm thi...",
      "Áp dụng ràng buộc cứng...",
      "Tối ưu hóa với ràng buộc mềm...",
      "Kiểm tra tính hợp lệ...",
      "Hoàn thành xếp lịch!",
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setProgress(((stepIndex + 1) / steps.length) * 100);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setResults({
          success: true,
          totalGroups: 25,
          scheduledGroups: 23,
          conflicts: 2,
          duration: "2m 34s",
          violations: [
            { type: "Mềm", constraint: "MAX_EXAMS_PER_DAY", count: 3 },
            { type: "Mềm", constraint: "NO_CAMPUS_TRAVEL", count: 1 },
          ],
        });
      }
    }, 1000);
  };

  const handleStopScheduling = () => {
    setIsRunning(false);
    setCurrentStep("Đã dừng");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xếp lịch tự động</h1>
        <p className="mt-2 text-gray-600">
          Cấu hình ràng buộc và chạy thuật toán xếp lịch thi
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Session Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Chọn đợt thi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSession === session.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {session.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {session.scheduledGroups}/{session.totalGroups} nhóm
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (session.scheduledGroups / session.totalGroups) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints Configuration */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Cấu hình ràng buộc
            </h2>
            <div className="space-y-4">
              {constraints.map((constraint) => (
                <div
                  key={constraint.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={constraint.enabled}
                          onChange={() => handleToggleConstraint(constraint.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {constraint.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {constraint.description}
                          </p>
                        </div>
                      </div>

                      {/* Constraint Parameters */}
                      {constraint.enabled &&
                        constraint.code === "MAX_EXAMS_PER_DAY" && (
                          <div className="mt-3 ml-7">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số ca thi tối đa mỗi ngày:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="3"
                              value={constraint.params.maxExams}
                              onChange={(e) =>
                                handleUpdateParam(
                                  constraint.id,
                                  "maxExams",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        constraint.type === "Cứng"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {constraint.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Cài đặt thuật toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian tối đa (phút)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  defaultValue="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ tối ưu
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="fast">Nhanh</option>
                  <option value="balanced" selected>
                    Cân bằng
                  </option>
                  <option value="optimal">Tối ưu</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Control Buttons */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Điều khiển
            </h2>

            {!isRunning ? (
              <button
                onClick={handleStartScheduling}
                disabled={
                  !currentSession ||
                  currentSession.scheduledGroups === currentSession.totalGroups
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-5 w-5" />
                Bắt đầu xếp lịch
              </button>
            ) : (
              <button
                onClick={handleStopScheduling}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Pause className="h-5 w-5" />
                Dừng xếp lịch
              </button>
            )}

            {currentSession?.scheduledGroups ===
              currentSession?.totalGroups && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Đợt thi này đã được xếp lịch hoàn chỉnh
              </p>
            )}
          </div>

          {/* Progress */}
          {(isRunning || progress > 0) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tiến độ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="text-sm font-medium text-gray-900">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {currentStep && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {isRunning && <Clock className="h-4 w-4 animate-spin" />}
                    <span>{currentStep}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Kết quả
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Xếp lịch thành công
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tổng nhóm:</span>
                    <span className="ml-2 font-medium">
                      {results.totalGroups}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Đã xếp:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {results.scheduledGroups}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Xung đột:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {results.conflicts}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Thời gian:</span>
                    <span className="ml-2 font-medium">{results.duration}</span>
                  </div>
                </div>

                {results.violations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Vi phạm ràng buộc mềm:
                    </h4>
                    <div className="space-y-1">
                      {results.violations.map((violation, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-yellow-700"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            {violation.constraint}: {violation.count} trường hợp
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Zap className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Lưu ý</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Ràng buộc cứng bắt buộc phải thỏa mãn</li>
                  <li>• Ràng buộc mềm sẽ được tối ưu hóa</li>
                  <li>• Quá trình có thể mất vài phút</li>
                  <li>• Có thể dừng bất cứ lúc nào</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSchedule;
