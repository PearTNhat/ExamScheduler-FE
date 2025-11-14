import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { apiExamStudent } from "~/apis/studentsApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { formatDate } from "~/utils/date";

function ExamSchedule() {
  const { accessToken, user } = useSelector((state) => state.user);

  // State management
  const [examSessions, setExamSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [studentExamData, setStudentExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const fetchExamSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const response = await apiGetExamSessions({
        accessToken,
        // params: { page: 1, limit: 100 }, // Get all exam sessions
      });

      if (response.code === 200) {
        setExamSessions(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách kỳ thi");
      }
    } catch (error) {
      console.error("Error fetching exam sessions:", error);
      showToastError("Lỗi khi tải danh sách kỳ thi");
    } finally {
      setLoadingSessions(false);
    }
  }, [accessToken]);

  const fetchStudentExams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiExamStudent({
        accessToken,
        examSessionId: parseInt(selectedSessionId),
      });

      if (response.code === 200) {
        setStudentExamData(response.data);
        showToastSuccess("Đã tải lịch thi thành công");
      } else {
        showToastError(response.message || "Lỗi khi tải lịch thi");
        setStudentExamData(null);
      }
    } catch (error) {
      showToastError("Lỗi khi tải lịch thi" + error.message);
      setStudentExamData(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedSessionId]);

  // Fetch exam sessions on component mount
  useEffect(() => {
    if (accessToken) {
      fetchExamSessions();
    }
  }, [accessToken, fetchExamSessions]);

  // Fetch student exam schedule when session is selected
  useEffect(() => {
    if (selectedSessionId && accessToken) {
      fetchStudentExams();
    }
  }, [selectedSessionId, accessToken, fetchStudentExams]);

  const handleRefresh = () => {
    if (selectedSessionId) {
      fetchStudentExams();
    }
  };

  const getExamStatusColor = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);

    if (examDateObj < today) {
      return "bg-gray-100 text-gray-800 border-gray-200"; // Đã thi
    } else if (examDateObj.toDateString() === today.toDateString()) {
      return "bg-red-100 text-red-800 border-red-200"; // Hôm nay
    } else {
      return "bg-green-100 text-green-800 border-green-200"; // Sắp thi
    }
  };

  const getExamStatusText = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);

    if (examDateObj < today) {
      return "Đã thi";
    } else if (examDateObj.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else {
      return "Sắp thi";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Lịch thi của tôi</h1>
          </div>
          <p className="text-indigo-100">
            Xem lịch thi cá nhân theo từng kỳ thi
          </p>
        </div>
      </div>

      {/* Session Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Chọn kỳ thi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={selectedSessionId}
                onValueChange={setSelectedSessionId}
                disabled={loadingSessions}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kỳ thi để xem lịch..." />
                </SelectTrigger>
                <SelectContent>
                  {examSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{session.name}</span>
                        <span className="text-sm text-gray-500">
                          {session.startDate &&
                            session.endDate &&
                            `${formatDate(session.startDate)} - ${formatDate(
                              session.endDate
                            )}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSessionId && (
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
            )}
          </div>

          {loadingSessions && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Đang tải danh sách kỳ thi...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Info & Exam List */}
      {selectedSessionId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Lịch thi cá nhân
              </div>
              {studentExamData && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {studentExamData.exams?.length || 0} môn thi
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-500">Đang tải lịch thi...</p>
              </div>
            ) : studentExamData ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {studentExamData.student?.name ||
                          user?.fullName ||
                          "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Mã SV:{" "}
                        {studentExamData.student?.studentCode ||
                          user?.studentCode ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exam List */}
                {studentExamData.exams && studentExamData.exams.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      Danh sách môn thi ({studentExamData.exams.length} môn)
                    </h4>

                    <div className="space-y-4">
                      {studentExamData.exams.map((exam, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {exam.course}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Thời gian: {exam.duration} phút
                              </p>
                            </div>
                            <Badge
                              className={`px-3 py-1 text-xs font-medium rounded-full border ${getExamStatusColor(
                                exam.date
                              )}`}
                            >
                              {getExamStatusText(exam.date)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(exam.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{exam.slot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>Phòng {exam.room}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có lịch thi
                    </h3>
                    <p className="text-gray-500">
                      Bạn chưa có môn thi nào trong kỳ thi này.
                    </p>
                  </div>
                )}
              </div>
            ) : selectedSessionId ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có dữ liệu
                </h3>
                <p className="text-gray-500">
                  Vui lòng chọn kỳ thi để xem lịch thi của bạn.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Empty State when no session selected */}
      {!selectedSessionId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-800">
                Chọn kỳ thi để xem lịch
              </h3>
              <p className="text-amber-700 text-sm mt-1">
                Vui lòng chọn kỳ thi từ danh sách phía trên để xem lịch thi cá
                nhân của bạn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamSchedule;
