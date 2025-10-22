import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Calendar, CheckCircle2 } from "lucide-react";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import Pagination from "~/components/pagination/Pagination";
import { formatDate } from "~/utils/date";

export default function ExamSessionPickerModal({
  open,
  onOpenChange,
  onSelect,
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const { accessToken } = useSelector((state) => state.user);

  // Fetch exam sessions with search and pagination
  const fetchSessions = async (page = 1, name = "", accessToken) => {
    try {
      setLoading(true);
      const response = await apiGetExamSessions({
        accessToken,
        params: {
          page,
          limit: 10,
          name: name.trim() || undefined,
        },
      });

      if (response.code === 200) {
        setSessions(response.data || []);
        // setPagination({
        //   currentPage: response.data.meta.page,
        //   totalPages: response.data.meta.totalPages,
        // });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách đợt thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách đợt thi");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchSessions(1, "", accessToken);
      setSearchTerm("");
      setSelectedSession(null);
    }
  }, [open, accessToken]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchSessions(1, searchTerm, accessToken);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchSessions(page, searchTerm);
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
  };

  const handleConfirm = () => {
    if (selectedSession) {
      onSelect(selectedSession);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-purple-600" />
            Chọn Đợt thi
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn đợt thi cho ca thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên đợt thi..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Tên đợt thi</TableHead>
                <TableHead className="font-semibold">
                  Thời gian bắt đầu
                </TableHead>
                <TableHead className="font-semibold">
                  Thời gian kết thúc
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-purple-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy đợt thi phù hợp"
                          : "Chưa có đợt thi nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className={`cursor-pointer hover:bg-purple-50 transition-colors ${
                      selectedSession?.id === session.id ? "bg-purple-100" : ""
                    }`}
                    onClick={() => handleSelectSession(session)}
                  >
                    <TableCell className="text-center">
                      {selectedSession?.id === session.id && (
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{session.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{session.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(session.start_date)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(session.end_date)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && sessions.length > 0 && (
          <div className="border-t pt-4">
            {/* <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            /> */}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedSession ? (
              <span>
                Đã chọn: <strong>{selectedSession.name}</strong> (ID:{" "}
                {selectedSession.id})
              </span>
            ) : (
              <span>Chưa chọn đợt thi nào</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedSession}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
