import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  BookOpen,
  Users,
  LogIn,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "~/stores/action/user";
import { userActions } from "~/stores/slice/userSlice";
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { accessToken, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // Mock user data - replace with actual auth state
  const mockUser = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@ptit.edu.vn",
    studentId: "B21DCCN001",
    avatar: null,
  };

  const navigation = [
    { name: "Trang chủ", href: "/", icon: Calendar },
    { name: "Tra cứu lịch thi", href: "/#exam-lookup", icon: BookOpen },
    { name: "Hướng dẫn", href: "/#features", icon: Users },
  ];
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser({ accessToken }));
    }
  }, [accessToken]);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ExamScheduler
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Hệ thống xếp lịch thi PTIT
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons or User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                        {mockUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {mockUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mockUser.studentId}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {mockUser.name}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {mockUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/user"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/user/change-password"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Đổi mật khẩu</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => dispatch(userActions.logout())}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={mockUser.avatar}
                          alt={mockUser.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                          {mockUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mockUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {mockUser.studentId}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/user"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                      to="/user/change-password"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Đổi mật khẩu</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Đăng nhập</span>
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium mt-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
