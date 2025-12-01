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
import { apiExamLecturer } from "~/apis/lecturesApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { formatDate } from "~/utils/date";

function ExamSchedule() {
  const { accessToken, userData } = useSelector((state) => state.user);

  // State management
  const [examSessions, setExamSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Determine user role
  const isStudent = userData?.roles?.some((role) => role.name === "SINH_VIEN");
  const isLecturer = userData?.roles?.some(
    (role) => role.name === "GIANG_VIEN"
  );

  const fetchExamSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const response = await apiGetExamSessions({
        accessToken,
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

  const fetchExamSchedule = useCallback(async () => {
    if (!userData?.id) {
      showToastError("Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isStudent) {
        const studentId = userData.id;
        response = await apiExamStudent({
          accessToken,
          studentId,
          examSessionId: parseInt(selectedSessionId),
        });
      } else if (isLecturer) {
        const lecturerId = userData.id;
        response = await apiExamLecturer({
          accessToken,
          lecturerId,
          examSessionId: parseInt(selectedSessionId),
        });
      } else {
        showToastError("Không xác định được vai trò của người dùng");
        return;
      }

      if (response.code === 200) {
        setExamData(response.data);
        showToastSuccess("Đã tải lịch thi thành công");
      } else {
        showToastError(response.message || "Lỗi khi tải lịch thi");
        setExamData(null);
      }
    } catch (error) {
      showToastError("Lỗi khi tải lịch thi: " + error.message);
      setExamData(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedSessionId, userData, isStudent, isLecturer]);

  // Fetch exam sessions on component mount
  useEffect(() => {
    if (accessToken) {
      fetchExamSessions();
    }
  }, [accessToken, fetchExamSessions]);

  // Fetch exam schedule when session is selected
  useEffect(() => {
    if (selectedSessionId && accessToken && userData?.id) {
      fetchExamSchedule();
    }
  }, [selectedSessionId, accessToken, userData?.id, fetchExamSchedule]);

  const handleRefresh = () => {
    if (selectedSessionId) {
      fetchExamSchedule();
    }
  };

  const getExamStatusColor = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);

    if (examDateObj < today) {
      return "bg-gray-100 text-gray-800 border-gray-200";
    } else if (examDateObj.toDateString() === today.toDateString()) {
      return "bg-red-100 text-red-800 border-red-200";
    } else {
      return "bg-green-100 text-green-800 border-green-200";
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
            <h1 className="text-3xl font-bold">
              {isStudent
                ? "Lịch thi của tôi"
                : isLecturer
                ? "Lịch coi thi của tôi"
                : "Lịch thi"}
            </h1>
          </div>
          <p className="text-indigo-100">
            {isStudent
              ? "Xem lịch thi cá nhân theo từng kỳ thi"
              : isLecturer
              ? "Xem lịch coi thi theo từng kỳ thi"
              : "Xem lịch theo từng kỳ thi"}
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

      {/* Exam Info & List */}
      {selectedSessionId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                {isStudent
                  ? "Lịch thi cá nhân"
                  : isLecturer
                  ? "Lịch coi thi"
                  : "Lịch thi"}
              </div>
              {examData && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {examData.exams?.length || 0}{" "}
                  {isStudent ? "môn thi" : "ca coi thi"}
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
            ) : examData ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {examData.student?.name ||
                          examData.lecturer?.name ||
                          userData?.email ||
                          "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isStudent
                          ? "Mã SV: "
                          : isLecturer
                          ? "Mã GV: "
                          : "Mã: "}
                        {examData.student?.studentCode ||
                          examData.lecturer?.lecturerCode ||
                          userData?.studentCode ||
                          userData?.lecturerCode ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exam List */}
                {examData.exams && examData.exams.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {isStudent
                        ? `Danh sách môn thi (${examData.exams.length} môn)`
                        : `Danh sách ca coi thi (${examData.exams.length} ca)`}
                    </h4>

                    <div className="space-y-4">
                      {examData.exams.map((exam, index) => (
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
                      {isStudent
                        ? "Bạn chưa có môn thi nào trong kỳ thi này."
                        : "Bạn chưa có ca coi thi nào trong kỳ thi này."}
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
                  Vui lòng chọn kỳ thi để xem lịch{" "}
                  {isStudent ? "thi" : "coi thi"} của bạn.
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
                Vui lòng chọn kỳ thi từ danh sách phía trên để xem lịch{" "}
                {isStudent ? "thi" : isLecturer ? "coi thi" : "thi"} của bạn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamSchedule;
