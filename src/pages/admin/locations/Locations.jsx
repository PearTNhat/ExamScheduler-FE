import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Building,
  Hash,
} from "lucide-react";
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
import LocationFormModal from "./components/LocationModal";
import {
  apiGetLocations,
  apiCreateLocation,
  apiUpdateLocation,
  apiDeleteLocation,
} from "../../../apis/locations";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "../../../utils/alert";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state) => state.user);

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await apiGetLocations();
      if (response.code === 200) {
        setLocations(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách cơ sở");
      }
    } catch (error) {
      showToastError("Lỗi khi tải danh sách cơ sở");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter locations
  const filteredLocations = locations.filter((location) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      location.code?.toLowerCase().includes(searchLower) ||
      location.name?.toLowerCase().includes(searchLower) ||
      location.address?.toLowerCase().includes(searchLower)
    );
  });

  // Handle add location
  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowModal(true);
  };

  // Handle edit location
  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;
      if (editingLocation) {
        response = await apiUpdateLocation({
          id: editingLocation.id,
          body: data,
          accessToken,
        });
      } else {
        // Create
        response = await apiCreateLocation({
          body: data,
          accessToken,
        });
      }

      if (response.code === 200) {
        showToastSuccess(
          editingLocation
            ? "Cập nhật cơ sở thành công"
            : "Thêm cơ sở thành công"
        );
        setShowModal(false);
        fetchLocations();
      } else {
        showToastError(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToastError("Có lỗi xảy ra khi lưu cơ sở");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteLocation = async (location) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc chắn muốn xóa cơ sở "${location.name}"?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiDeleteLocation({
          id: location.id,
          accessToken,
        });

        if (response.code === 200) {
          showToastSuccess("Xóa cơ sở thành công");
          fetchLocations();
        } else {
          showToastError(response.message || "Có lỗi xảy ra khi xóa cơ sở");
        }
      } catch (error) {
        showToastError("Có lỗi xảy ra khi xóa cơ sở");
        console.error(error);
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
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý cơ sở</h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các cơ sở trong hệ thống
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
              placeholder="Tìm kiếm theo mã, tên, địa chỉ..."
              className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddLocation}
            className="gap-2 h-11 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm cơ sở
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Id</TableHead>
              <TableHead className="font-semibold">Mã cơ sở</TableHead>
              <TableHead className="font-semibold">Tên cơ sở</TableHead>
              <TableHead className="font-semibold">Địa chỉ</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLocations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <MapPin className="h-12 w-12 text-gray-300" />
                    <p className="font-medium">
                      {searchTerm
                        ? "Không tìm thấy cơ sở phù hợp"
                        : "Chưa có cơ sở nào"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm">
                        Nhấn "Thêm cơ sở" để tạo cơ sở mới
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLocations.map((location) => (
                <TableRow key={location.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <Hash className="h-4 w-4 text-green-600" />
                      </div>
                      {location.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <Building className="h-4 w-4 text-green-600" />
                      </div>
                      {location.code}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{location.address}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(location.createAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLocation(location)}
                        title="Chỉnh sửa"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLocation(location)}
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
      </div>

      {/* Modal Add/Edit */}
      <LocationFormModal
        open={showModal}
        onOpenChange={setShowModal}
        editingLocation={editingLocation}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Locations;
