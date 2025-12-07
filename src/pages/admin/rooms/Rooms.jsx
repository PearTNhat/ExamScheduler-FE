import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Building2, MapPin } from "lucide-react";
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
import RoomFormModal from "./components/RoomModal";
import {
  apiGetRooms,
  apiCreateRoom,
  apiUpdateRoom,
  apiDeleteRoom,
} from "~/apis/roomsApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiGetRooms({
        params: {
          page: currentParams.page,
          limit: 1000,
          code: currentParams.code,
        },
      });
      if (response.code == 200) {
        setRooms(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách phòng thi");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách phòng thi");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, [currentParams.page, currentParams.code]);
  // Handle add room
  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  // Handle edit room
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingRoom) {
        // Update
        response = await apiUpdateRoom({
          id: editingRoom.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateRoom({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200) {
        showToastSuccess(
          editingRoom
            ? "Cập nhật phòng thi thành công"
            : "Thêm phòng thi thành công"
        );
        setShowModal(false);
        fetchRooms();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi lưu phòng thi");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle delete
  const handleDeleteRoom = async (room) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa phòng thi "${room.code}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteRoom({
          id: room.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa phòng thi thành công");
          fetchRooms();
        } else {
          showToastError(response.message || "Có lỗi xảy ra khi xóa phòng thi");
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa phòng thi");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("code", searchTerm.trim());
          prev.set("page", "1"); // Quay về trang 1 khi tìm kiếm
        } else {
          prev.delete("code");
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);
  const handlePageChange = (page) =>
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page }));
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý phòng thi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các phòng thi trong hệ thống
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
              placeholder="Tìm kiếm theo mã phòng..."
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddRoom}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm phòng thi
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Id</TableHead>
              <TableHead className="font-semibold">Mã phòng</TableHead>
              <TableHead className="font-semibold">Sức chứa</TableHead>
              <TableHead className="font-semibold">Cơ sở</TableHead>
              <TableHead className="font-semibold">Loại phòng</TableHead>
              {/* <TableHead className="font-semibold">Trạng thái</TableHead> */}
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy phòng thi phù hợp"
                        : "Chưa có phòng thi nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm phòng thi" để tạo phòng mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rooms?.map((room) => (
                <TableRow key={room.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      {room.id}
                    </div>
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
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{room.capacity}</span>
                      <span className="text-xs text-gray-500">người</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span> {room?.location.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        room.type === "LT"
                          ? "default"
                          : room.type === "LAB"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {room.type === "LT" ? "Lý thuyết" : "Thực hành"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRoom(room)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRoom(room)}
                        title="Xóa"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal Add/Edit */}
      <RoomFormModal
        open={showModal}
        onOpenChange={setShowModal}
        editingRoom={editingRoom}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Rooms;
