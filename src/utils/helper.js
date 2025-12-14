const formatConstraintType = (type) => {
    const typeMap = {
        ROOM_CAPACITY: "Vượt sức chứa phòng",
        ROOM_TYPE_MISMATCH: "Loại phòng không phù hợp",
        MISSING_SECOND_PROCTOR: "Thiếu giám thị phụ",
        PROCTOR_UNAVAILABLE: "Giám thị không có sẵn",
        ROOM_CONFLICT: "Xung đột phòng thi",
        PROCTOR_CONFLICT: "Xung đột giám thị",
        STUDENT_CONFLICT: "Xung đột sinh viên",
        MAX_EXAMS_PER_DAY: "Vượt số ca thi/ngày",
        TOO_MANY_LOCATIONS: "Vượt giới hạn địa điểm",
        LECTURER_OVERLOAD: "Vượt số ca giám thị",
        TOO_MANY_SLOTS_PER_COURSE: "Vượt số ca thi/môn",
        LECTURER_LOCATION_MOVEMENT: "Di chuyển địa điểm quá xa",
    };
    return typeMap[type] || type;
};

export { formatConstraintType };