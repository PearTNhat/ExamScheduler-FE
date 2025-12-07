import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, UserCircle, Shield, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";
import { fetchCurrentUser } from "~/stores/action/user";

function Header({ user, isLoggedIn, accessToken }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate("/login");
  };

  // Get initials from user name
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser({ accessToken }));
    } else {
      navigate("/login");
    }
  }, [accessToken]);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-6">
        {/* Logo/Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ExamScheduler</h1>
              <p className="text-xs text-gray-600">
                Hệ thống xếp lịch thi PTIT
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Admin button + User Menu OR Login button */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                  <div className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors cursor-pointer">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-indigo-100">
                      <AvatarImage
                        src={user?.avatar}
                        alt={`${user?.firstName} ${user?.lastName}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                        {getInitials(user?.firstName, user?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.roles.includes("ADMIN") && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Quản trị</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
