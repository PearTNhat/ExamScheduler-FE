import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { Search, Clock } from "lucide-react";
import { apiGetExamSlots } from "~/apis/exam-slotApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function ExamSlotPickerModal({
  open,
  onOpenChange,
  onSelect,
  multiSelect = false, // ✅ THÊM: Cho phép chọn nhiều
  selectedSlots = [], // ✅ THÊM: Danh sách đã chọn từ bên ngoài
}) {
  const { accessToken } = useSelector((state) => state.user);
  const [examSlots, setExamSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedSlots, setLocalSelectedSlots] = useState([]); // ✅ THÊM: State local
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch exam slots
  const fetchExamSlots = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      const response = await apiGetExamSlots({
        accessToken,
        params,
      });

      if (response.code === 200) {
        setExamSlots(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách ca thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách ca thi");
    } finally {
      setLoading(false);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (open && accessToken) {
      fetchExamSlots(1);
      setSearchTerm("");
      if (multiSelect) {
        setLocalSelectedSlots(selectedSlots); // ✅ Chỉ đồng bộ khi multi-select
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accessToken]);

  const handlePageChange = (page) => {
    fetchExamSlots(page);
  };

  const handleSelect = (examSlot) => {
    if (multiSelect) {
      // ✅ Multi select: Toggle
      const isSelected = localSelectedSlots.some((s) => s.id === examSlot.id);
      if (isSelected) {
        setLocalSelectedSlots((prev) =>
          prev.filter((s) => s.id !== examSlot.id)
        );
      } else {
        setLocalSelectedSlots((prev) => [...prev, examSlot]);
      }
    } else {
      // ✅ Single select: Chọn và đóng ngay
      onSelect(examSlot);
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    if (multiSelect) {
      onSelect(localSelectedSlots);
    }
    onOpenChange(false);
  };

  const isSlotSelected = (slotId) => {
    return localSelectedSlots.some((s) => s.id === slotId);
  };

  // Filter exam slots by search term (client-side)
  const filteredExamSlots = examSlots.filter((slot) => {
    if (!searchTerm) return true;
    const slotName = slot.slotName || "";
    const search = searchTerm.toLowerCase();
    return slotName.toLowerCase().includes(search);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6 text-green-600" />
            Chọn Ca Thi
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn ca thi cho lịch thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên ca thi..."
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
                <TableHead className="font-semibold">Tên ca thi</TableHead>
                <TableHead className="font-semibold">
                  Thời gian bắt đầu
                </TableHead>
                <TableHead className="font-semibold">
                  Thời gian kết thúc
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredExamSlots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy ca thi phù hợp"
                          : "Chưa có ca thi nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExamSlots.map((slot) => {
                  const selected = multiSelect && isSlotSelected(slot.id);
                  return (
                    <TableRow
                      key={slot.id}
                      className={`cursor-pointer hover:bg-green-50 transition-colors ${
                        selected
                          ? "bg-green-100 border-l-4 border-green-600"
                          : ""
                      }`}
                      onClick={() => handleSelect(slot)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {multiSelect && (
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => handleSelect(slot)}
                              className="h-4 w-4 text-green-600 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div className="p-1.5 bg-green-100 rounded">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">{slot.slotName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50">
                          {slot.startTime}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50">
                          {slot.endTime}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {multiSelect ? (
                          <Badge variant={selected ? "default" : "outline"}>
                            {selected ? "Đã chọn" : "Chọn"}
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(slot);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Chọn
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading &&
          filteredExamSlots.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="border-t pt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPageCount={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          {multiSelect && (
            <div className="text-sm text-gray-600">
              Đã chọn:{" "}
              <span className="font-semibold">{localSelectedSlots.length}</span>{" "}
              ca thi
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            {multiSelect && (
              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700"
                disabled={localSelectedSlots.length === 0}
              >
                Xác nhận ({localSelectedSlots.length})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
