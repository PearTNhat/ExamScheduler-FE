import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Search, Building } from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      code: "P101",
      name: "Phòng 101",
      capacity: 50,
      campus: "Cầu Giấy",
      building: "Tòa A",
      floor: 1,
      equipment: ["Máy chiếu", "Micro", "Máy tính"],
      status: "Hoạt động",
    },
    {
      id: 2,
      code: "P102",
      name: "Phòng 102",
      capacity: 45,
      campus: "Cầu Giấy",
      building: "Tòa A",
      floor: 1,
      equipment: ["Máy chiếu", "Máy tính"],
      status: "Hoạt động",
    },
    {
      id: 3,
      code: "P201",
      name: "Phòng 201",
      capacity: 60,
      campus: "Hòa Lạc",
      building: "Tòa B",
      floor: 2,
      equipment: ["Máy chiếu", "Micro", "Máy tính", "Bảng thông minh"],
      status: "Bảo trì",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState("");

  const campuses = [...new Set(rooms.map((room) => room.campus))];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampus = !filterCampus || room.campus === filterCampus;
    return matchesSearch && matchesCampus;
  });

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng thi này?")) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng thi</h1>
        <p className="mt-2 text-gray-600">Tạo và quản lý danh sách phòng thi</p>
      </div>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value)}
          >
            <option value="">Tất cả cơ sở</option>
            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm phòng
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {room.code}
                  </h3>
                  <p className="text-sm text-gray-500">{room.name}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditRoom(room)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                <span>
                  {room.campus} - {room.building} - Tầng {room.floor}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Sức chứa: <span className="font-medium">{room.capacity}</span>
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    room.status === "Hoạt động"
                      ? "bg-green-100 text-green-800"
                      : room.status === "Bảo trì"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Thiết bị:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((item, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Room */}
      {showModal && (
        <RoomModal
          room={editingRoom}
          onClose={() => setShowModal(false)}
          onSave={(roomData) => {
            if (editingRoom) {
              setRooms(
                rooms.map((r) =>
                  r.id === editingRoom.id ? { ...r, ...roomData } : r
                )
              );
            } else {
              setRooms([...rooms, { id: Date.now(), ...roomData }]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const RoomModal = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: room?.code || "",
    name: room?.name || "",
    capacity: room?.capacity || 30,
    campus: room?.campus || "",
    building: room?.building || "",
    floor: room?.floor || 1,
    equipment: room?.equipment || [],
    status: room?.status || "Hoạt động",
  });

  const [newEquipment, setNewEquipment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addEquipment = () => {
    if (
      newEquipment.trim() &&
      !formData.equipment.includes(newEquipment.trim())
    ) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, newEquipment.trim()],
      });
      setNewEquipment("");
    }
  };

  const removeEquipment = (item) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((eq) => eq !== item),
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {room ? "Chỉnh sửa phòng thi" : "Thêm phòng thi mới"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã phòng
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sức chứa
            </label>
            <input
              type="number"
              min="10"
              max="200"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cơ sở
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.campus}
                onChange={(e) =>
                  setFormData({ ...formData, campus: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tòa nhà
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.building}
                onChange={(e) =>
                  setFormData({ ...formData, building: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tầng
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Ngưng sử dụng">Ngưng sử dụng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thiết bị
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nhập thiết bị..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addEquipment())
                }
              />
              <button
                type="button"
                onClick={addEquipment}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.equipment.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                  onClick={() => removeEquipment(item)}
                >
                  {item} ×
                </span>
              ))}
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {room ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
