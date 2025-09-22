import { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const ImportRegistrations = () => {
  const [selectedSession, setSelectedSession] = useState("");
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const sessions = [
    { id: 1, name: "Cuối kỳ 2024-1", status: "Đang tiến hành" },
    { id: 2, name: "Giữa kỳ 2024-1", status: "Hoàn thành" },
  ];

  const handleFileSelect = (selectedFile) => {
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setImportResult(null);
    } else {
      alert("Vui lòng chọn file Excel (.xlsx)");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleImport = async () => {
    if (!selectedSession || !file) {
      alert("Vui lòng chọn đợt thi và file Excel");
      return;
    }

    setImporting(true);

    // Simulate import process
    setTimeout(() => {
      setImportResult({
        success: true,
        totalRows: 150,
        successRows: 145,
        errorRows: 5,
        errors: [
          { row: 15, error: "Không tìm thấy mã sinh viên SV999" },
          { row: 23, error: "Không tìm thấy mã môn học CS999" },
          { row: 45, error: "Sinh viên đã đăng ký môn này" },
          { row: 67, error: "Dữ liệu không hợp lệ" },
          { row: 89, error: "Mã sinh viên trống" },
        ],
      });
      setImporting(false);
    }, 3000);
  };

  const downloadTemplate = () => {
    // Create a mock Excel template download
    const link = document.createElement("a");
    link.href = "#";
    link.download = "template_dang_ky_thi.xlsx";
    link.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import đăng ký thi</h1>
        <p className="mt-2 text-gray-600">
          Tải lên file Excel chứa danh sách sinh viên đăng ký thi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload file đăng ký
            </h2>

            {/* Session Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn đợt thi
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="">-- Chọn đợt thi --</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Kéo thả file Excel vào đây hoặc
                      </span>
                      <span className="text-blue-600 hover:text-blue-500">
                        {" "}
                        chọn file
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Chỉ hỗ trợ file Excel (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={downloadTemplate}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải template
              </button>

              <button
                onClick={handleImport}
                disabled={!selectedSession || !file || importing}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {importing ? "Đang import..." : "Import"}
              </button>
            </div>
          </div>

          {/* Import Result */}
          {importResult && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Kết quả import
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {importResult.totalRows}
                  </div>
                  <div className="text-sm text-gray-500">Tổng số dòng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.successRows}
                  </div>
                  <div className="text-sm text-gray-500">Thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.errorRows}
                  </div>
                  <div className="text-sm text-gray-500">Lỗi</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Chi tiết lỗi:
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-red-600 mb-1"
                      >
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          Dòng {error.row}: {error.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hướng dẫn</h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Định dạng file
                </h4>
                <p className="text-sm text-gray-600">
                  File Excel (.xlsx) với các cột: mã_sinh_viên, mã_môn_học
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Dữ liệu mẫu
                </h4>
                <p className="text-sm text-gray-600">
                  SV001, CS101
                  <br />
                  SV002, MA101
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Lưu ý</h4>
                <p className="text-sm text-gray-600">
                  Mã sinh viên và mã môn học phải đã tồn tại trong hệ thống
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Chú ý</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Dữ liệu import sẽ ghi đè lên dữ liệu đăng ký hiện tại của đợt
                  thi được chọn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportRegistrations;
