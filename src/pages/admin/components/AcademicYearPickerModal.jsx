import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Calendar, CheckCircle2 } from "lucide-react";
import { apiGetAcademicYears } from "~/apis/academic-yearsApi";
import { useSelector } from "react-redux";
import { formatDate } from "~/utils/date";

const AcademicYearPickerModal = ({ open, onOpenChange, onSelect }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (open && accessToken) {
      fetchAcademicYears();
    }
  }, [open, accessToken]);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await apiGetAcademicYears({ accessToken });
      if (response.code === 200) {
        setYears(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredYears = years.filter((year) =>
    year.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (year) => {
    onSelect(year);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Chọn năm học
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm năm học..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
              </div>
            ) : filteredYears.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">Không tìm thấy năm học</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50">
                  <TableRow>
                    <TableHead>Tên năm học</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Chọn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredYears.map((year) => (
                    <TableRow
                      key={year.id}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSelect(year)}
                    >
                      <TableCell className="font-medium">{year.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span>Từ: {formatDate(year.startDate)}</span>
                          <span>Đến: {formatDate(year.endDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(year);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcademicYearPickerModal;
