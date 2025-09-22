import { useState } from "react";
import {
  Plus,
  Users,
  Play,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

const ExamGroups = () => {
  const [selectedSession, setSelectedSession] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [generating, setGenerating] = useState(false);

  const sessions = [
    { id: "1", name: "Cuối kỳ 2024-1" },
    { id: "2", name: "Giữa kỳ 2024-1" },
  ];

  const [examGroups, setExamGroups] = useState([
    {
      id: 1,
      code: "CS101-CK2024-01",
      courseName: "Lập trình hướng đối tượng",
      courseCode: "CS101",
      expectedStudents: 85,
      actualStudents: 82,
      status: "Đã xếp lịch",
      examDate: "2024-12-15",
      examTime: "Sáng",
      room: "P101",
    },
    {
      id: 2,
      code: "CS201-CK2024-01",
      courseName: "Cấu trúc dữ liệu",
      courseCode: "CS201",
      expectedStudents: 72,
      actualStudents: 70,
      status: "Chưa xếp lịch",
      examDate: null,
      examTime: null,
      room: null,
    },
    {
      id: 3,
      code: "MA101-CK2024-01",
      courseName: "Toán rời rạc",
      courseCode: "MA101",
      expectedStudents: 95,
      actualStudents: 95,
      status: "Đã xếp lịch",
      examDate: "2024-12-16",
      examTime: "Chiều",
      room: "P102",
    },
  ]);

  const filteredGroups = examGroups.filter((group) => {
    const matchesSearch =
      group.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateGroups = async () => {
    setGenerating(true);
    // Simulate API call to generate exam groups
    setTimeout(() => {
      // Add new generated groups
      const newGroups = [
        {
          id: Date.now(),
          code: "PHY101-CK2024-01",
          courseName: "Vật lý đại cương",
          courseCode: "PHY101",
          expectedStudents: 60,
          actualStudents: 58,
          status: "Chưa xếp lịch",
          examDate: null,
          examTime: null,
          room: null,
        },
      ];
      setExamGroups([...examGroups, ...newGroups]);
      setGenerating(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xếp lịch":
        return "bg-green-100 text-green-800";
      case "Chưa xếp lịch":
        return "bg-yellow-100 text-yellow-800";
      case "Đang xử lý":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý nhóm thi</h1>
        <p className="mt-2 text-gray-600">
          Tạo và quản lý các nhóm thi từ dữ liệu đăng ký
        </p>
      </div>

      {/* Session Selection and Stats */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đợt thi
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {examGroups.length}
            </div>
            <div className="text-sm text-gray-500">Tổng nhóm thi</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {examGroups.filter((g) => g.status === "Đã xếp lịch").length}
            </div>
            <div className="text-sm text-gray-500">Đã xếp lịch</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">
              {examGroups.filter((g) => g.status === "Chưa xếp lịch").length}
            </div>
            <div className="text-sm text-gray-500">Chưa xếp lịch</div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm thi..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đã xếp lịch">Đã xếp lịch</option>
            <option value="Chưa xếp lịch">Chưa xếp lịch</option>
          </select>
        </div>

        <button
          onClick={handleGenerateGroups}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {generating ? "Đang tạo..." : "Tạo nhóm thi"}
        </button>
      </div>

      {/* Exam Groups Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhóm thi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Môn học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sinh viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lịch thi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <tr key={group.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {group.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        {group.courseCode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {group.courseName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {group.actualStudents}/{group.expectedStudents}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (group.actualStudents / group.expectedStudents) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      group.status
                    )}`}
                  >
                    {group.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {group.examDate ? (
                    <div>
                      <div>
                        {new Date(group.examDate).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {group.examTime} - {group.room}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Chưa xếp</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có nhóm thi
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {examGroups.length === 0
              ? "Chưa có nhóm thi nào được tạo cho đợt thi này."
              : "Không tìm thấy nhóm thi phù hợp với bộ lọc."}
          </p>
        </div>
      )}

      {/* Generation Info Panel */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Filter className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Quy trình tạo nhóm thi
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Hệ thống phân tích dữ liệu đăng ký thi của đợt được chọn
                </li>
                <li>
                  Nhóm sinh viên theo môn học và chia nhỏ theo sức chứa phòng
                  thi
                </li>
                <li>Tạo các nhóm thi với mã định danh duy nhất</li>
                <li>Sẵn sàng cho bước xếp lịch thi tự động</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamGroups;
