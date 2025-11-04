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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  File,
  AlertTriangle,
  Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import {
  showAlertError,
  showToastSuccess,
  showToastWarning,
} from "~/utils/alert";
import { formatFileSize } from "~/utils/file";

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
        showAlertError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
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
      showToastWarning("Vui lòng chọn file để upload");
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

      const { data } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setResult(data.data);

      // Show appropriate message based on result
      if (data.imported > 0 && data.failed === 0) {
        showToastSuccess(`Đã import thành công ${data.imported} giảng viên`);
      } else if (data.imported > 0 && data.failed > 0) {
        showToastWarning(
          `Import thành công ${data.imported}, thất bại ${data.failed} giảng viên`
        );
      } else if (data.failed > 0) {
        showAlertError(
          `Import thất bại ${data.failed} giảng viên. Vui lòng kiểm tra lại file.`
        );
      }
      if (data.imported > 0) {
        setTimeout(() => {
          console.log("fetch again");
          onUploadSuccess();
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
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Upload Danh Sách Giảng Viên
          </DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa danh sách giảng viên để thêm hàng loạt vào
            hệ thống
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
                📋 Định dạng file Excel bao gồm các cột: Mã giảng viên, Họ, Tên,
                Email, Mã khoa, Giám thị (true/false)
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
                  className="bg-green-600 hover:bg-green-700 min-w-[120px]"
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
                  <File className="w-8 h-8 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-300"
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
                  <Card className="border-green-300 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Thành công
                          </p>
                          <p className="text-3xl font-bold text-green-700">
                            {result.imported}
                          </p>
                        </div>
                        <CheckCircle2 className="w-12 h-12 text-green-500 opacity-70" />
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
}
