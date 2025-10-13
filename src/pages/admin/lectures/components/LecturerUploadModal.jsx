import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

export function LecturerUploadModal({ open, onOpenChange, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { accessToken } = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        "Mã giảng viên": "GV001",
        Họ: "Nguyễn Văn",
        Tên: "A",
        Email: "nguyenvana@example.com",
        "Mã khoa": "1",
        "Giám thị": "true",
      },
      {
        "Mã giảng viên": "GV002",
        Họ: "Trần Thị",
        Tên: "B",
        Email: "tranthib@example.com",
        "Mã khoa": "2",
        "Giám thị": "false",
      },
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lecturers");

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // Mã giảng viên
      { wch: 15 }, // Họ
      { wch: 15 }, // Tên
      { wch: 30 }, // Email
      { wch: 10 }, // Mã khoa
      { wch: 10 }, // Giám thị
    ];

    // Download file
    XLSX.writeFile(wb, "lecturer_template.xlsx");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file để upload");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3000/lecturers/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setResult(data);

      // Call success callback after a delay to show results
      if (data.imported > 0) {
        setTimeout(() => {
          onUploadSuccess?.();
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Có lỗi xảy ra khi upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Upload Danh Sách Giảng Viên
          </DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa danh sách giảng viên để thêm hàng loạt vào
            hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Template */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Tải Template Mẫu
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Tải xuống file Excel mẫu để biết định dạng chính xác
            </p>
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải Template
            </Button>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Chọn File Excel</label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                File đã chọn: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Result Display */}
          {result && (
            <div className="space-y-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Kết Quả Upload
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Thành công</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {result.imported}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Thất bại</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {result.failed}
                  </p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Chi Tiết Lỗi ({result.errors.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {result.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-2 rounded text-sm"
                      >
                        <Badge variant="destructive" className="mr-2">
                          Dòng {error.row}
                        </Badge>
                        <span className="text-red-700 dark:text-red-300">
                          {error.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
