import React, { useState } from "react";
import {
  Bell,
  Settings,
  Check,
  X,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

function Notifications() {
  // Mock data - Replace with actual API data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Thông báo lịch thi Giữa kỳ",
      message:
        "Lịch thi giữa kỳ môn Lập trình Web đã được cập nhật. Thời gian: 08:00 - 10:00, Phòng TC-101",
      type: "exam",
      read: false,
      createdAt: "2025-01-10T08:00:00Z",
      urgent: true,
    },
    {
      id: 2,
      title: "Cập nhật điểm thi",
      message:
        "Điểm thi môn Cơ sở dữ liệu đã được cập nhật. Bạn có thể xem chi tiết trong phần kết quả thi.",
      type: "grade",
      read: false,
      createdAt: "2025-01-09T14:30:00Z",
      urgent: false,
    },
    {
      id: 3,
      title: "Nhắc nhở đăng ký môn học",
      message:
        "Thời gian đăng ký môn học kỳ mới sẽ bắt đầu từ ngày 15/01/2025. Vui lòng chuẩn bị sẵn danh sách môn học.",
      type: "registration",
      read: true,
      createdAt: "2025-01-08T10:15:00Z",
      urgent: false,
    },
    {
      id: 4,
      title: "Thông báo bảo trì hệ thống",
      message:
        "Hệ thống sẽ được bảo trì từ 22:00 - 02:00 ngày 12/01/2025. Trong thời gian này, một số tính năng có thể không khả dụng.",
      type: "system",
      read: true,
      createdAt: "2025-01-07T16:45:00Z",
      urgent: false,
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "exam":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "grade":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "registration":
        return <Info className="h-5 w-5 text-indigo-600" />;
      case "system":
        return <Settings className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type, urgent = false) => {
    if (urgent) return "border-l-red-500 bg-red-50";

    switch (type) {
      case "exam":
        return "border-l-blue-500 bg-blue-50";
      case "grade":
        return "border-l-green-500 bg-green-50";
      case "registration":
        return "border-l-indigo-500 bg-indigo-50";
      case "system":
        return "border-l-gray-500 bg-gray-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Thông báo</h1>
          </div>
          <p className="text-indigo-100">
            Xem các thông báo mới nhất từ hệ thống
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
              Trang thông báo sẽ sớm được hoàn thiện với đầy đủ tính năng.
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Thông báo ({unreadCount} chưa đọc)
            </h2>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 inline mr-2" />
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl ${
                !notification.read
                  ? "ring-2 ring-indigo-100 border-indigo-200"
                  : ""
              }`}
            >
              <div
                className={`border-l-4 ${getNotificationColor(
                  notification.type,
                  notification.urgent
                )}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {notification.urgent && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Khẩn cấp
                            </span>
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          )}
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa thông báo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
