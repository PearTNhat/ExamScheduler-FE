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
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Building2, CheckSquare, Square } from "lucide-react";
import { apiGetRooms } from "~/apis/roomsApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function RoomPickerModal({
  open,
  onOpenChange,
  onConfirm,
  selectedRooms,
  singleSelect = false,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedRooms, setTempSelectedRooms] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch rooms with search and pagination
  const fetchRooms = async (page = 1, code = "") => {
    try {
      setLoading(true);
      const response = await apiGetRooms({
        page,
        limit: 10,
        code: code.trim() || undefined,
      });
      if (response.data) {
        setRooms(response.data.data || []);
        setPagination({
          currentPage: response.data.meta?.page || 1,
          totalPages: response.data.meta?.totalPages || 1,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách phòng");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (open) {
      fetchRooms(1, "");
      setSearchTerm("");

      // Initialize with current selected rooms (no selectAll logic)
      setTempSelectedRooms([...selectedRooms]);
    }
  }, [open, selectedRooms]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchRooms(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, open]);

  const handlePageChange = (page) => {
    fetchRooms(page, searchTerm);
  };

  // Check if all rooms in current page are selected
  const areAllCurrentPageRoomsSelected = () => {
    return rooms.every((room) =>
      tempSelectedRooms.some((selected) => selected.roomId === room.id)
    );
  };

  // Select/deselect all rooms in current page
  const handleSelectAllCurrentPage = (checked) => {
    if (checked) {
      // Add all current page rooms to selection (if not already selected)
      const newRooms = rooms
        .filter(
          (room) =>
            !tempSelectedRooms.some((selected) => selected.roomId === room.id)
        )
        .map((room) => ({
          roomId: room.id,
          capacity: room.capacity,
          location: room.location?.name || "N/A",
          locationId: room.location?.id,
          code: room.code,
        }));
      setTempSelectedRooms([...tempSelectedRooms, ...newRooms]);
    } else {
      // Remove all current page rooms from selection
      const currentPageRoomIds = rooms.map((room) => room.id);
      setTempSelectedRooms(
        tempSelectedRooms.filter(
          (selected) => !currentPageRoomIds.includes(selected.roomId)
        )
      );
    }
  };

  const handleToggleRoom = (room) => {
    const isSelected = tempSelectedRooms.some((r) => r.roomId === room.id);

    if (singleSelect) {
      // Single select mode: only one room can be selected
      if (isSelected) {
        setTempSelectedRooms([]);
      } else {
        setTempSelectedRooms([
          {
            roomId: room.id,
            capacity: room.capacity,
            location: room.location?.name || "N/A",
            locationId: room.location?.id,
            code: room.code,
          },
        ]);
      }
    } else {
      // Multi select mode: can select multiple rooms
      if (isSelected) {
        setTempSelectedRooms(
          tempSelectedRooms.filter((r) => r.roomId !== room.id)
        );
      } else {
        setTempSelectedRooms([
          ...tempSelectedRooms,
          {
            roomId: room.id,
            capacity: room.capacity,
            location: room.location?.name || "N/A",
            locationId: room.location?.id,
            code: room.code,
          },
        ]);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedRooms);
  };

  const isRoomSelected = (roomId) => {
    return tempSelectedRooms.some((r) => r.roomId === roomId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-blue-600" />
            Chọn Phòng Thi
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn phòng thi cho kỳ thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã phòng..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Select All Current Page Checkbox */}
        {!singleSelect && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Checkbox
              id="select-all-current-page"
              checked={areAllCurrentPageRoomsSelected()}
              onCheckedChange={handleSelectAllCurrentPage}
            />
            <label
              htmlFor="select-all-current-page"
              className="text-sm font-medium cursor-pointer"
            >
              Chọn tất cả trang hiện tại ({rooms.length} phòng) - Đã chọn:{" "}
              {tempSelectedRooms.length} phòng
            </label>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Mã phòng</TableHead>
                <TableHead className="font-semibold">Địa điểm</TableHead>
                <TableHead className="font-semibold">Sức chứa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy phòng phù hợp"
                          : "Chưa có phòng nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => {
                  const isSelected = isRoomSelected(room.id);
                  return (
                    <TableRow
                      key={room.id}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                        isSelected ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleToggleRoom(room)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleRoom(room)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          {room.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {room.location?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{room.capacity} người</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && rooms.length > 0 && (
          <div className="border-t pt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {tempSelectedRooms.length > 0 ? (
              <span className="text-blue-600 font-medium">
                ✓ Đã chọn: <strong>{tempSelectedRooms.length}</strong> phòng
              </span>
            ) : (
              <span>Chưa chọn phòng nào</span>
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
