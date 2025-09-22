import {
  Calendar,
  BookOpen,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Upload,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = [
    {
      name: "Tổng đợt thi",
      value: "5",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      name: "Môn học",
      value: "24",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      name: "Phòng thi",
      value: "12",
      icon: MapPin,
      color: "bg-yellow-500",
    },
    {
      name: "Sinh viên",
      value: "856",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "Lịch thi đã xếp",
      value: "18",
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      name: "Đang chờ xếp",
      value: "6",
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  const recentSessions = [
    {
      name: "Cuối kỳ 2024-1",
      period: "15/12/2024 - 30/12/2024",
      status: "Đang tiến hành",
    },
    {
      name: "Giữa kỳ 2024-1",
      period: "01/11/2024 - 15/11/2024",
      status: "Hoàn thành",
    },
    {
      name: "Cuối kỳ 2023-2",
      period: "15/05/2024 - 30/05/2024",
      status: "Hoàn thành",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="mt-2 text-gray-600">
          Quản lý và theo dõi lịch thi của trường
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Sessions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Đợt thi gần đây
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Danh sách các đợt thi được tạo gần đây
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {recentSessions.map((session, index) => (
            <div key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {session.name}
                  </h4>
                  <p className="text-sm text-gray-500">{session.period}</p>
                </div>
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.status === "Đang tiến hành"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
          <Calendar className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-900">Tạo đợt thi mới</h3>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập đợt thi cho học kỳ
          </p>
        </button>

        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
          <Upload className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-medium text-gray-900">Import đăng ký</h3>
          <p className="text-sm text-gray-500 mt-1">
            Tải lên file đăng ký môn học
          </p>
        </button>

        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
          <Clock className="h-8 w-8 text-orange-500 mb-3" />
          <h3 className="font-medium text-gray-900">Xếp lịch tự động</h3>
          <p className="text-sm text-gray-500 mt-1">Chạy thuật toán xếp lịch</p>
        </button>

        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
          <BarChart3 className="h-8 w-8 text-purple-500 mb-3" />
          <h3 className="font-medium text-gray-900">Báo cáo</h3>
          <p className="text-sm text-gray-500 mt-1">Xem thống kê và báo cáo</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
