import React, { useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const StudentUploadModal = ({ open, onOpenChange, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  // Download template Excel
  const handleDownloadTemplate = () => {
    const template = [
      {
        "Mã sinh viên": "B21DCCN001",
        Họ: "Nguyễn Văn",
        Tên: "An",
        Email: "annv@example.com",
        "Số điện thoại": "0987654321",
        "Ngày sinh": "2003-01-15",
        "Giới tính": "male",
        "Địa chỉ": "Hà Nội",
      },
      {
        "Mã sinh viên": "B21DCCN002",
        Họ: "Trần Thị",
        Tên: "Bình",
        Email: "binhtt@example.com",
        "Số điện thoại": "0912345678",
        "Ngày sinh": "2003-05-20",
        "Giới tính": "female",
        "Địa chỉ": "Hải Phòng",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách sinh viên");

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // Mã sinh viên
      { wch: 15 }, // Họ
      { wch: 10 }, // Tên
      { wch: 25 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 12 }, // Ngày sinh
      { wch: 10 }, // Giới tính
      { wch: 30 }, // Địa chỉ
    ];

    XLSX.writeFile(wb, "Mau_danh_sach_sinh_vien.xlsx");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls")
      ) {
        setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn file để upload");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3000/students/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFile(null);
        setTimeout(() => {
          onUploadSuccess?.();
          onOpenChange(false);
        }, 1500);
      } else {
        setError(result.message || "Upload thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi upload file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Upload Danh sách Sinh viên
          </DialogTitle>
          <DialogDescription>
            Tải file mẫu, điền thông tin và upload danh sách sinh viên hàng loạt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Template Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Bước 1: Tải file mẫu
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tải xuống file Excel mẫu với định dạng chuẩn
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  className="gap-2 bg-white hover:bg-blue-50 border-blue-300"
                >
                  <Download className="h-4 w-4" />
                  Tải file mẫu Excel
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Bước 2: Upload file đã điền
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Chọn file Excel đã điền đầy đủ thông tin sinh viên
                </p>

                {/* File Input */}
                <div className="space-y-3">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">
                        {file ? file.name : "Click để chọn file"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Excel (.xlsx, .xls)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Selected File Display */}
                  {file && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-300">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                Upload thành công! Đang tải lại danh sách...
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Đang upload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentUploadModal;
