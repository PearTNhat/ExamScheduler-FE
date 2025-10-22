import { useState, useEffect, useCallback } from "react";
import { Calendar, List, Plus, Download, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  apiGetExams,
  apiCreateExam,
  apiUpdateExam,
  apiDeleteExam,
} from "~/apis/examsApi";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import Pagination from "~/components/pagination/Pagination";

// Import components
import ExamCalendar from "./components/ExamCalendar";
import ExamListView from "./components/ExamListView";
import ExamFormModal from "./components/ExamFormModal";
import ExamDetailModal from "./components/ExamDetailModal";

const ViewSchedule = () => {
  const [viewMode, setViewMode] = useState("list");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchSessions();
    }
  }, [accessToken]);

  const fetchSessions = async () => {
    try {
      const response = await apiGetExamSessions({
        accessToken,
        params: { page: 1, limit: 100 },
      });
      if (response.code === 200) {
        setSessions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedSession && selectedSession !== "all") {
        params.sessionId = selectedSession;
      }

      const response = await apiGetExams({ accessToken, params });
      if (response.code === 200) {
        setExams(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách lịch thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách lịch thi");
    } finally {
      setLoading(false);
    }
  }, [accessToken, pagination.currentPage, searchTerm, selectedSession]);

  useEffect(() => {
    if (accessToken) {
      fetchExams();
    }
  }, [accessToken, pagination.currentPage, selectedSession]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchExams();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleOpenAddModal = () => {
    setEditingExam(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (exam) => {
    setEditingExam(exam);
    setIsFormModalOpen(true);
  };

  const handleViewExam = (exam) => {
    setViewingExam(exam);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingExam) {
        response = await apiUpdateExam({
          id: editingExam.id,
          body: data,
          accessToken,
        });
      } else {
        response = await apiCreateExam({ body: data, accessToken });
      }

      if (response.code === 200 || response.code === 201) {
        showToastSuccess(
          editingExam
            ? "Cập nhật lịch thi thành công!"
            : "Thêm lịch thi mới thành công!"
        );
        setIsFormModalOpen(false);
        setEditingExam(null);
        fetchExams();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (exam) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc muốn xóa lịch thi này?`
    );
    if (confirmed) {
      try {
        const response = await apiDeleteExam({
          id: exam.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa lịch thi thành công!");
          fetchExams();
        } else {
          showToastError(response.message || "Lỗi khi xóa lịch thi");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa lịch thi");
      }
    }
  };

  const handleEventClick = (exam) => {
    handleViewExam(exam);
  };

  const handleDateClick = (dateInfo) => {
    setEditingExam(null);
    setIsFormModalOpen(true);
  };

  const exportSchedule = () => {
    showToastSuccess("Chức năng xuất lịch đang được phát triển");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xem lịch thi</h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và xem lịch thi theo nhiều hình thức
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm lịch thi..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} variant="outline" className="h-11">
              Tìm kiếm
            </Button>
          </div>

          <Select value={selectedSession} onValueChange={setSelectedSession}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Chọn đợt thi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đợt thi</SelectItem>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id.toString()}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="h-11"
            >
              <List className="h-4 w-4 mr-2" />
              Danh sách
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
              className="h-11"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Lịch
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportSchedule} variant="outline" className="h-11">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch thi
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số lịch thi</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {exams.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trạng thái OK</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {exams.filter((e) => e.status === "oke").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Badge className="bg-green-600">OK</Badge>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trạng thái Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {exams.filter((e) => e.status === "failed").length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Badge className="bg-red-600">Failed</Badge>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          <ExamListView
            exams={exams}
            loading={loading}
            onView={handleViewExam}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteExam}
          />
          {console.log("exam", exams)}
          {!loading && exams.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPageCount={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <ExamCalendar
          exams={exams}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      <ExamFormModal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);
          if (!open) {
            setEditingExam(null);
          }
        }}
        editingExam={editingExam}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        accessToken={accessToken}
      />

      <ExamDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        exam={viewingExam}
      />
    </div>
  );
};

export default ViewSchedule;
