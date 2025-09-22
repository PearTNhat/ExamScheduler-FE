import React from "react";
import {
  Calendar,
  Search,
  Download,
  ChevronRight,
  Info,
  BookOpen,
  MapPin,
} from "lucide-react";
import ExamLookup from "../../../components/ExamLookup";

function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12" id="hero">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tra cứu lịch thi nhanh chóng
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nhập mã sinh viên để xem lịch thi chi tiết, thông tin phòng thi và
            các lưu ý quan trọng
          </p>
        </div>

        {/* Exam Lookup Component */}
        <div className="max-w-4xl mx-auto mb-16" id="exam-lookup">
          <ExamLookup />
        </div>

        {/* Features Section */}
        <div className="mb-16" id="features">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Tính năng nổi bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Tra cứu nhanh chóng
              </h4>
              <p className="text-gray-600">
                Chỉ cần nhập mã sinh viên để xem toàn bộ lịch thi một cách nhanh
                chóng và chính xác
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Thông tin chi tiết
              </h4>
              <p className="text-gray-600">
                Hiển thị đầy đủ thông tin: ngày thi, giờ thi, phòng thi, số ghế
                và các lưu ý quan trọng
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Tải về tiện lợi
              </h4>
              <p className="text-gray-600">
                Tải về lịch thi dưới dạng file để in ấn hoặc lưu trữ trên thiết
                bị cá nhân
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-16" id="about">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Thống kê hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                2,500+
              </div>
              <div className="text-gray-600">Sinh viên</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Môn học</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Phòng thi</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">10+</div>
              <div className="text-gray-600">Đợt thi</div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Truy cập nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Lịch thi sắp tới
                </h4>
              </div>
              <p className="text-gray-600 mb-4">
                Xem các kỳ thi sắp diễn ra trong tuần này
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Cuối kỳ 2024-1</span>
                  <span className="text-xs text-blue-600">15/12 - 30/12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Giữa kỳ 2024-2</span>
                  <span className="text-xs text-gray-600">Sắp mở đăng ký</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Sơ đồ phòng thi
                </h4>
              </div>
              <p className="text-gray-600 mb-4">
                Xem vị trí các phòng thi trong khuôn viên trường
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Cơ sở Cầu Giấy</span>
                  <span className="text-xs text-green-600">25 phòng</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Cơ sở Hòa Lạc</span>
                  <span className="text-xs text-green-600">30 phòng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-3">
                Lưu ý quan trọng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Có mặt tại phòng thi trước 30 phút so với giờ thi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Mang theo thẻ sinh viên và giấy tờ tùy thân có ảnh
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Ngồi đúng số ghế được phân công</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tắt hoặc để chế độ im lặng các thiết bị điện tử</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tuân thủ nghiêm túc các quy định của phòng thi</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Liên hệ phòng đào tạo: 024.xxx.xxxx nếu có thắc mắc
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 Email: daotao@hust.edu.vn</p>
                <p>📞 Điện thoại: 024.xxx.xxxx</p>
                <p>📍 Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
              <div className="space-y-2 text-gray-400">
                <p>• Trang chủ trường</p>
                <p>• Phòng đào tạo</p>
                <p>• Thông báo</p>
                <p>• Hướng dẫn sử dụng</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Thời gian hỗ trợ</h4>
              <div className="space-y-2 text-gray-400">
                <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                <p>Thứ 7: 8:00 - 12:00</p>
                <p>Chủ nhật: Nghỉ</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© 2024 Trường Đại học Bách khoa Hà Nội. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
