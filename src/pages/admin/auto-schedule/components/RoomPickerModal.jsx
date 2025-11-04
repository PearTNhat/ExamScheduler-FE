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
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedRooms, setTempSelectedRooms] = useState([]);
  const [excludedRooms, setExcludedRooms] = useState([]); // Rooms excluded when selectAll is true
  const [selectAll, setSelectAll] = useState(false);
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

      // Check if selectedRooms has selectAll flag or is empty array
      if (selectedRooms.length === 0 || selectedRooms[0]?.selectAll) {
        setSelectAll(true);
        setExcludedRooms(selectedRooms[0]?.excludedRoomIds || []);
        setTempSelectedRooms([]);
      } else {
        setSelectAll(false);
        setExcludedRooms([]);
        setTempSelectedRooms([...selectedRooms]);
      }
    }
  }, [open]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchRooms(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchRooms(page, searchTerm);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      // Switch to select all mode, clear individual selections
      setTempSelectedRooms([]);
      setExcludedRooms([]);
    } else {
      // Switch to individual mode, clear excluded list
      setExcludedRooms([]);
      setTempSelectedRooms([]);
    }
  };

  const handleToggleRoom = (room) => {
    if (selectAll) {
      // In select all mode: toggle exclude list
      const isExcluded = excludedRooms.includes(room.id);

      if (isExcluded) {
        // Remove from excluded list (include this room)
        setExcludedRooms(excludedRooms.filter((id) => id !== room.id));
      } else {
        // Add to excluded list
        setExcludedRooms([...excludedRooms, room.id]);
      }
    } else {
      // In individual select mode: toggle selected list
      const isSelected = tempSelectedRooms.some((r) => r.roomId === room.id);

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
            location: room.location?.code || "N/A",
            code: room.code,
          },
        ]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectAll) {
      // Return selectAll flag with excluded room IDs
      onConfirm([
        {
          selectAll: true,
          excludedRoomIds: excludedRooms,
        },
      ]);
    } else {
      onConfirm(tempSelectedRooms);
    }
  };

  const isRoomSelected = (roomId) => {
    if (selectAll) {
      // In select all mode: selected if NOT in excluded list
      return !excludedRooms.includes(roomId);
    }
    // In individual mode: selected if in tempSelectedRooms
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

        {/* Select All Checkbox */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Checkbox
            id="select-all-rooms"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all-rooms"
            className="text-sm font-medium cursor-pointer"
          >
            Chọn tất cả phòng{" "}
            {selectAll
              ? excludedRooms.length > 0
                ? `(Loại trừ ${excludedRooms.length} phòng)`
                : "(Tất cả phòng)"
              : `(${tempSelectedRooms.length} phòng đã chọn)`}
          </label>
        </div>

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
                      } ${selectAll ? "opacity-90" : ""}`}
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
            {selectAll ? (
              excludedRooms.length > 0 ? (
                <span className="text-blue-600 font-medium">
                  ✓ Tất cả phòng (Loại trừ{" "}
                  <strong>{excludedRooms.length}</strong> phòng)
                </span>
              ) : (
                <span className="text-blue-600 font-medium">
                  ✓ Đã chọn tất cả phòng
                </span>
              )
            ) : tempSelectedRooms.length > 0 ? (
              <span>
                Đã chọn: <strong>{tempSelectedRooms.length}</strong> phòng
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
