// src/components/modals/LocationSelectionModal.js
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"; // Điều chỉnh đường dẫn
import { Input } from "~/components/ui/input"; // Điều chỉnh đường dẫn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"; // Điều chỉnh đường dẫn
import { Search } from "lucide-react";
import { apiGetLocations } from "~/apis/locationsApi"; // Điều chỉnh đường dẫn
import { showToastError } from "~/utils/alert"; // Điều chỉnh đường dẫn
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";

const LocationSelectionModal = ({ open, onOpenChange, onSelectLocation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await apiGetLocations({
        page: currentParams.page,
        limit: 10,
        name: currentParams.code,
      });
      // Giả sử API trả về { code: 200, message: '...', data: { rows: [], count: 10, page: 1, totalPages: 2 } }
      if (response.code === 200) {
        setLocations(response.data.data || []);
        setPagination({
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        showToastError(response.message || "Không thể tải danh sách địa điểm");
      }
    } catch (error) {
      showToastError(error.message || "Lỗi khi tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [currentParams]);

  // Hàm quan trọng: xử lý khi người dùng chọn một dòng
  const handleSelect = (location) => {
    onSelectLocation(location); // Gửi đối tượng location đã chọn về cho component cha
    onOpenChange(false); // Đóng modal
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
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chọn cơ sở</DialogTitle>
            <DialogDescription>
              Tìm kiếm và chọn một cơ sở từ danh sách bên dưới.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm theo tên cơ sở..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-md border flex-grow overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên cơ sở</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-48">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : locations.length > 0 ? (
                  locations.map((loc) => (
                    <TableRow
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell>{loc.code}</TableCell>
                      <TableCell className="font-medium">{loc.name}</TableCell>
                      <TableCell>{loc.address}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-48">
                      Không tìm thấy cơ sở nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center items-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationSelectionModal;
