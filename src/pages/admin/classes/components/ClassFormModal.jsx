import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Building2, Search } from "lucide-react";
import { useSelector } from "react-redux";
import DepartmentPickerModal from "./DepartmentPickerModal";

export default function ClassFormModal({
  open,
  onOpenChange,
  editingClass,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    departmentId: null,
  });
  const [departmentName, setDepartmentName] = useState("");
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data when editing
  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name || "",
        code: editingClass.code || "",
        departmentId: editingClass.departmentId || null,
      });
      setDepartmentName(editingClass.department?.name || "");
    } else {
      setFormData({
        name: "",
        code: "",
        departmentId: null,
      });
      setDepartmentName("");
    }
    setErrors({});
  }, [editingClass, open]);

  const handleDepartmentSelect = (department) => {
    setFormData({ ...formData, departmentId: department.id });
    setDepartmentName(department.name);
    setShowDepartmentPicker(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên lớp không được để trống";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Mã lớp không được để trống";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Vui lòng chọn khoa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingClass ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
            </DialogTitle>
            <DialogDescription>
              {editingClass
                ? "Cập nhật thông tin lớp học"
                : "Điền đầy đủ thông tin để tạo lớp học mới"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Mã lớp */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Mã lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: D21CQCN02-N"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            {/* Tên lớp */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Lớp Công Nghệ 2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Khoa - Department Picker */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Khoa <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="department"
                  placeholder="Chọn khoa..."
                  value={departmentName}
                  readOnly
                  className={`flex-1 cursor-pointer ${
                    errors.departmentId ? "border-red-500" : ""
                  }`}
                  onClick={() => setShowDepartmentPicker(true)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDepartmentPicker(true)}
                  className="px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.departmentId && (
                <p className="text-sm text-red-500">{errors.departmentId}</p>
              )}
              {formData.departmentId && (
                <p className="text-xs text-gray-500">
                  ID Khoa: {formData.departmentId}
                </p>
              )}
            </div>
          </form>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang xử lý...
                </>
              ) : editingClass ? (
                "Cập nhật"
              ) : (
                "Thêm lớp"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Department Picker Modal */}
      <DepartmentPickerModal
        open={showDepartmentPicker}
        onOpenChange={setShowDepartmentPicker}
        onSelect={handleDepartmentSelect}
      />
    </>
  );
}
