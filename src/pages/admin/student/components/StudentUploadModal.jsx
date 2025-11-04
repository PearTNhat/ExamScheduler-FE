import React, { useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  File,
  AlertTriangle,
  Info,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import {
  showAlertError,
  showToastSuccess,
  showToastWarning,
} from "~/utils/alert";
import { formatFileSize } from "~/utils/file";

const StudentUploadModal = ({ open, onOpenChange, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
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
        Lớp: "D21CQCN01",
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
        Lớp: "D21CQCN01",
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
      { wch: 12 }, // lớp
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
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        showAlertError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      showToastWarning("Vui lòng chọn file để upload");
      return;
    }

    setUploading(true);
    setResult(null);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setResult(data.data);

      // Show appropriate message based on result
      if (data.data.imported > 0 && data.data.failed === 0) {
        showToastSuccess(
          `Đã import thành công ${data.data.imported} sinh viên`
        );
      } else if (data.data.imported > 0 && data.data.failed > 0) {
        showToastWarning(
          `Import thành công ${data.data.imported}, thất bại ${data.data.failed} sinh viên`
        );
      } else if (data.data.failed > 0) {
        showAlertError(
          `Import thất bại ${data.data.failed} sinh viên. Vui lòng kiểm tra lại file.`
        );
      }

      // Call success callback after a delay to show results
      if (data.data.imported > 0) {
        setTimeout(() => {
          onUploadSuccess?.();
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlertError(error.message || "Có lỗi xảy ra khi upload file");
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Upload Danh Sách Sinh Viên
          </DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa danh sách sinh viên để thêm hàng loạt vào hệ
            thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions Card */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                <Info className="w-4 h-4" />
                Hướng Dẫn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-700">
                📋 Định dạng file Excel bao gồm các cột: Mã sinh viên, Họ, Tên,
                Email, Số điện thoại, Ngày sinh, Lớp, Giới tính, Địa chỉ
              </p>
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                size="sm"
                className="w-full bg-white hover:bg-blue-50 border-blue-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải File Template Mẫu
              </Button>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Chọn File Để Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="flex-1"
                  disabled={uploading}
                />
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
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

              {/* File Info */}
              {file && (
                <div className="bg-slate-50 p-3 rounded-lg border flex items-center gap-3">
                  <File className="w-8 h-8 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-300"
                  >
                    Đã chọn
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Display */}
          {result && (
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-slate-600" />
                  Kết Quả Import
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-blue-300 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Thành công
                          </p>
                          <p className="text-3xl font-bold text-blue-700">
                            {result.imported}
                          </p>
                        </div>
                        <CheckCircle2 className="w-12 h-12 text-blue-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-300 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800 mb-1">
                            Thất bại
                          </p>
                          <p className="text-3xl font-bold text-red-700">
                            {result.failed}
                          </p>
                        </div>
                        <XCircle className="w-12 h-12 text-red-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* File Info */}
                {(result.filename || result.size) && (
                  <div className="bg-slate-50 p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        Thông tin file
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {result.filename && (
                        <div>
                          <span className="text-gray-500">Tên file: </span>
                          <span className="font-medium">{result.filename}</span>
                        </div>
                      )}
                      {result.size && (
                        <div>
                          <span className="text-gray-500">Kích thước: </span>
                          <span className="font-medium">
                            {formatFileSize(result.size)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Details Table */}
                {result.errors && result.errors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="font-semibold">
                        Chi Tiết Lỗi ({result.errors.length})
                      </h4>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-80 overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-red-50">
                            <TableRow>
                              <TableHead className="w-20">Dòng</TableHead>
                              <TableHead>Lỗi</TableHead>
                              <TableHead className="w-48">Dữ liệu</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.errors.map((error, idx) => (
                              <TableRow
                                key={idx}
                                className="hover:bg-red-50/50"
                              >
                                <TableCell>
                                  <Badge
                                    variant="destructive"
                                    className="font-mono"
                                  >
                                    {error.row}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-red-700">
                                  {error.error}
                                </TableCell>
                                <TableCell>
                                  {error.data && (
                                    <div className="text-xs text-gray-600 space-y-1">
                                      {Object.entries(error.data)
                                        .slice(0, 3)
                                        .map(([key, value]) => (
                                          <div key={key} className="truncate">
                                            <span className="font-medium">
                                              {key}:
                                            </span>{" "}
                                            {value || "N/A"}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
};

export default StudentUploadModal;
