import React from "react";
import {
  History,
  Clock,
  User,
  Calendar,
  AlertCircle,
  FileText,
  LogIn,
  Settings,
  UserCheck,
} from "lucide-react";

function ActivityHistory() {
  // Mock data - Replace with actual API data
  const activities = [
    {
      id: 1,
      type: "login",
      title: "Đăng nhập hệ thống",
      description: "Đăng nhập thành công từ địa chỉ IP 192.168.1.100",
      timestamp: "2025-01-10T08:30:00Z",
      status: "success",
    },
    {
      id: 2,
      type: "profile",
      title: "Cập nhật thông tin cá nhân",
      description: "Thay đổi số điện thoại và địa chỉ email",
      timestamp: "2025-01-09T15:45:00Z",
      status: "success",
    },
    {
      id: 3,
      type: "exam",
      title: "Xem lịch thi",
      description: "Truy cập trang lịch thi môn Lập trình Web",
      timestamp: "2025-01-09T14:20:00Z",
      status: "success",
    },
    {
      id: 4,
      type: "password",
      title: "Thay đổi mật khẩu",
      description: "Cập nhật mật khẩu đăng nhập thành công",
      timestamp: "2025-01-08T10:15:00Z",
      status: "success",
    },
    {
      id: 5,
      type: "login",
      title: "Đăng nhập thất bại",
      description: "Thử đăng nhập với mật khẩu không chính xác",
      timestamp: "2025-01-07T22:30:00Z",
      status: "failed",
    },
    {
      id: 6,
      type: "grades",
      title: "Xem kết quả thi",
      description: "Truy cập điểm thi môn Cơ sở dữ liệu",
      timestamp: "2025-01-07T16:45:00Z",
      status: "success",
    },
    {
      id: 7,
      type: "registration",
      title: "Xem môn học đăng ký",
      description: "Kiểm tra danh sách môn học đã đăng ký",
      timestamp: "2025-01-06T09:30:00Z",
      status: "success",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <LogIn className="h-5 w-5 text-blue-600" />;
      case "profile":
        return <User className="h-5 w-5 text-green-600" />;
      case "exam":
        return <Calendar className="h-5 w-5 text-indigo-600" />;
      case "password":
        return <Settings className="h-5 w-5 text-purple-600" />;
      case "grades":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "registration":
        return <UserCheck className="h-5 w-5 text-teal-600" />;
      default:
        return <History className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type, status) => {
    if (status === "failed") return "border-l-red-500 bg-red-50";

    switch (type) {
      case "login":
        return "border-l-blue-500 bg-blue-50";
      case "profile":
        return "border-l-green-500 bg-green-50";
      case "exam":
        return "border-l-indigo-500 bg-indigo-50";
      case "password":
        return "border-l-purple-500 bg-purple-50";
      case "grades":
        return "border-l-orange-500 bg-orange-50";
      case "registration":
        return "border-l-teal-500 bg-teal-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Thành công
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Thất bại
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Không xác định
          </span>
        );
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  };

  // Statistics
  const totalActivities = activities.length;
  const successfulActivities = activities.filter(
    (activity) => activity.status === "success"
  ).length;
  const failedActivities = activities.filter(
    (activity) => activity.status === "failed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Lịch sử hoạt động</h1>
          </div>
          <p className="text-indigo-100">
            Theo dõi các hoạt động gần đây của bạn
          </p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-800">
              Tính năng đang phát triển
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Trang lịch sử hoạt động sẽ sớm được hoàn thiện với đầy đủ tính
              năng.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Thành công</p>
              <p className="text-2xl font-bold text-green-600">
                {successfulActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Thất bại</p>
              <p className="text-2xl font-bold text-red-600">
                {failedActivities}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Hoạt động gần đây
        </h2>

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}

              <div
                className={`border-l-4 rounded-xl ${getActivityColor(
                  activity.type,
                  activity.status
                )}`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-2 shadow-sm border border-gray-200">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        {getStatusBadge(activity.status)}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {activity.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                        <span>•</span>
                        <span>
                          {new Date(activity.timestamp).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityHistory;
