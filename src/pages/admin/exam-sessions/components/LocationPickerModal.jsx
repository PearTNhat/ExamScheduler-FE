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
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import { apiGetLocations } from "~/apis/locationsApi";
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";

export default function LocationPickerModal({ open, onOpenChange, onSelect }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch locations with search and pagination
  const fetchLocations = async (page = 1, name = "") => {
    try {
      setLoading(true);
      const response = await apiGetLocations({
        page,
        limit: 10,
        name: name.trim() || undefined,
      });
      if (response.code === 200) {
        setLocations(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách cơ sở");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách cơ sở");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    if (open) {
      fetchLocations(1, "");
      setSearchTerm("");
      setSelectedLocation(null);
    }
  }, [open]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;

    const delayDebounceFn = setTimeout(() => {
      fetchLocations(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    fetchLocations(page, searchTerm);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-6 w-6 text-purple-600" />
            Chọn Cơ sở
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn cơ sở cho đợt thi
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên cơ sở..."
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
                <TableHead className="font-semibold">Mã cơ sở</TableHead>
                <TableHead className="font-semibold">Tên cơ sở</TableHead>
                <TableHead className="font-semibold">Địa chỉ</TableHead>
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
              ) : locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "Không tìm thấy cơ sở phù hợp"
                          : "Chưa có cơ sở nào"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow
                    key={location.id}
                    className={`cursor-pointer hover:bg-purple-50 transition-colors ${
                      selectedLocation?.id === location.id
                        ? "bg-purple-100"
                        : ""
                    }`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <TableCell className="text-center">
                      {selectedLocation?.id === location.id && (
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{location.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded">
                          <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        {location.code}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {location.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {location.address || "Chưa có địa chỉ"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && locations.length > 0 && (
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
            {selectedLocation ? (
              <span>
                Đã chọn: <strong>{selectedLocation.name}</strong> (ID:{" "}
                {selectedLocation.id})
              </span>
            ) : (
              <span>Chưa chọn cơ sở nào</span>
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
              disabled={!selectedLocation}
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
