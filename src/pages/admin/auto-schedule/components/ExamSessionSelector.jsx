import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ClipboardList, Calendar } from "lucide-react";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";

const ExamSessionSelector = ({ selectedSessionId, onSessionChange }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExamSessions();
  }, []);

  const fetchExamSessions = async () => {
    setLoading(true);
    try {
      const response = await apiGetExamSessions({ accessToken });
      if (response.data) {
        setSessions(response.data);
        if (!selectedSessionId && response.data.length > 0) {
          onSessionChange(response.data[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching exam sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedSession = sessions.find(
    (s) => s.id.toString() === selectedSessionId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Chọn đợt thi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Đang tải danh sách đợt thi...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có đợt thi nào
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="exam-session">Đợt thi</Label>
              <Select value={selectedSessionId} onValueChange={onSessionChange}>
                <SelectTrigger id="exam-session">
                  <SelectValue placeholder="Chọn đợt thi..." />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{session.name}</span>
                        {session.isActive && (
                          <Badge variant="success" className="ml-2">
                            Đang diễn ra
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Session Info */}
            {selectedSession && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="font-medium text-blue-900">
                  {selectedSession.name}
                </div>
                {/* <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-blue-700">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Bắt đầu:{" "}
                    {selectedSession.start_date
                      ? new Date(selectedSession.start_date).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </div>
                  <div className="text-blue-700">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Kết thúc:{" "}
                    {selectedSession.end_date
                      ? new Date(selectedSession.end_date).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </div>
                </div> */}
                {selectedSession.description && (
                  <div className="text-xs text-blue-600 border-t border-blue-200 pt-2">
                    {selectedSession.description}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamSessionSelector;
