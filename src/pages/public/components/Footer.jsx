import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Globe,
  BookOpen,
  Users,
  Settings,
  ExternalLink,
} from "lucide-react";

function Footer() {
  const quickLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Tra cứu lịch thi", href: "/#exam-lookup" },
    { name: "Hướng dẫn sử dụng", href: "/#features" },
    { name: "Thông tin", href: "/#about" },
  ];

  const systemLinks = [
    { name: "Quản trị hệ thống", href: "/admin", icon: Settings },
    { name: "Đăng nhập", href: "/login", icon: Users },
    { name: "Hỗ trợ kỹ thuật", href: "#", icon: BookOpen },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "Học viện Công nghệ Bưu chính Viễn thông",
      detail: "Km10, Đường Nguyễn Trãi, Hà Đông, Hà Nội",
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "(024) 3838 5356",
      detail: "Phòng Đào tạo",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@ptit.edu.vn",
      detail: "Hỗ trợ kỹ thuật",
    },
  ];

  const socialLinks = [
    {
      name: "Website PTIT",
      href: "https://ptit.edu.vn",
      icon: Globe,
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/ptit.edu.vn",
      icon: Facebook,
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@ptitedu",
      icon: Youtube,
      color: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ExamScheduler</h3>
                <p className="text-sm text-gray-400">Hệ thống xếp lịch thi</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Hệ thống quản lý và xếp lịch thi tự động cho Học viện Công nghệ
              Bưu chính Viễn thông, giúp tối ưu hóa quy trình tổ chức thi cử.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} transition-colors p-2 rounded-lg hover:bg-gray-800`}
                  title={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hệ thống</h4>
            <ul className="space-y-3">
              {systemLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <info.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{info.content}</p>
                    <p className="text-gray-400 text-sm">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© 2024 Học viện Công nghệ Bưu chính Viễn thông.</p>
              <p>Được phát triển bởi sinh viên PTIT.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <span className="text-xs">Phiên bản 1.0.0</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="text-white font-medium mb-1">
                  Hướng dẫn sử dụng
                </h5>
                <p className="text-gray-400 text-sm">
                  Sinh viên có thể tra cứu lịch thi bằng mã sinh viên. Quản trị
                  viên đăng nhập để quản lý hệ thống xếp lịch thi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
