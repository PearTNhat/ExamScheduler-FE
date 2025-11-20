import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Save, Camera } from "lucide-react";
import { useSelector } from "react-redux";
function UserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { userData } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: userData,
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage("");

    try {
      console.log("Update profile:", data);
      setTimeout(() => {
        setMessage("Cập nhật thông tin thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Update profile error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
          <p className="text-indigo-100">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Họ và tên đệm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", {
                      required: "Họ và tên đệm là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ và tên đệm phải có ít nhất 2 ký tự",
                      },
                    })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Nguyễn Văn"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">⚠</span>{" "}
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", {
                      required: "Tên là bắt buộc",
                      minLength: {
                        value: 1,
                        message: "Tên phải có ít nhất 1 ký tự",
                      },
                    })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="An"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">⚠</span>{" "}
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="example@email.com"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Email không thể thay đổi
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg text-sm font-medium ${
                  message.includes("thành công")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
