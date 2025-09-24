import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserManager() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to StudentManager as the default user management page
    navigate("/admin/students", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

export default UserManager;
