import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar, Search, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import ExamSessionFormModal from "./components/ExamSessionFormModal";
import {
  apiGetExamSessions,
  apiCreateExamSession,
  apiUpdateExamSession,
  apiDeleteExamSession,
} from "~/apis/exam-sessionsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";

const ExamSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state) => state.user);

  // Fetch exam sessions from API
  useEffect(() => {
    if (accessToken) {
      fetchExamSessions();
    }
  }, [accessToken]);

  const fetchExamSessions = async () => {
    try {
      setLoading(true);
      const response = await apiGetExamSessions({ accessToken });
      if (response.code === 200) {
        setSessions(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách đợt thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách đợt thi");
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions by search term
  const filteredSessions = sessions.filter((session) =>
    session.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSession = () => {
    setEditingSession(null);
    setShowModal(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;
      if (editingSession) {
        // Update
        response = await apiUpdateExamSession({
          id: editingSession.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateExamSession({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingSession
            ? "Cập nhật đợt thi thành công"
            : "Thêm đợt thi thành công"
        );
        setShowModal(false);
        fetchExamSessions();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi lưu đợt thi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (session) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa đợt thi "${session.name}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteExamSession({
          accessToken,
          id: session.id,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa đợt thi thành công");
          fetchExamSessions();
        } else {
          showToastError(response.message || "Lỗi khi xóa đợt thi");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa đợt thi");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đợt thi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các đợt thi trong học kỳ
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên đợt thi..."
              className="pl-10 h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddSession}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm đợt thi
          </Button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {searchTerm
                ? "Không tìm thấy đợt thi nào"
                : "Chưa có đợt thi nào"}
            </p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Thử tìm kiếm với từ khóa khác
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-50 hover:to-purple-100/50">
                <TableHead className="font-semibold text-purple-900">
                  Tên đợt thi
                </TableHead>
                <TableHead className="font-semibold text-purple-900">
                  Thời gian
                </TableHead>
                <TableHead className="font-semibold text-purple-900">
                  Địa điểm
                </TableHead>
                <TableHead className="font-semibold text-purple-900">
                  Trạng thái
                </TableHead>
                <TableHead className="font-semibold text-purple-900">
                  Mô tả
                </TableHead>
                <TableHead className="text-right font-semibold text-purple-900">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="hover:bg-purple-50/30 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {session.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex flex-col space-y-1">
                      <span className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Bắt đầu:</span>
                        {formatDate(session.start_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Kết thúc:</span>
                        {formatDate(session.end_date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span>{session.location?.name || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={session.is_active ? "default" : "secondary"}
                      className={
                        session.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {session.is_active ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="max-w-xs truncate">
                      {session.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSession(session)}
                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(session)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Session Modal */}
      <ExamSessionFormModal
        open={showModal}
        onOpenChange={(isOpen) => {
          setShowModal(isOpen);
          if (!isOpen) {
            setEditingSession(null);
          }
        }}
        editingSession={editingSession}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ExamSessions;
