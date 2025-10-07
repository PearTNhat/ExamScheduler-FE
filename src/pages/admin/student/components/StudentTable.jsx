// src/components/StudentManager/StudentTable.js
import React from "react";
import { Mail, Phone, Edit2, Trash2, Users } from "lucide-react";

const StudentTable = ({
  students,
  selectedStudents,
  onSelectAll,
  onSelectStudent,
  onEdit,
  onDelete,
  loading,
  error,
}) => {
  const isAllSelected =
    students.length > 0 && selectedStudents.length === students.length;

  if (loading) {
    return (
      <div className="text-center py-12">Đang tải dữ liệu sinh viên...</div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Lỗi: {error}</div>;
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không có sinh viên
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Không tìm thấy sinh viên nào. Hãy thử thêm mới!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thông tin sinh viên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liên hệ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) =>
                    onSelectStudent(student.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {`${student.firstName} ${student.lastName}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.studentCode}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center mb-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    {student.email}
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {student.phoneNumber}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(student)}
                    className="text-green-600 hover:text-green-900 p-1 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(student.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
