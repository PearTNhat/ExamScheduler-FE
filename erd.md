@startuml
!theme plain

'==================== CỤM 1: DỮ LIỆU NỀN TẢNG (CORE FOUNDATION) ====================
' Các thực thể này ít thay đổi, là cơ sở cho hệ thống.
'---------------------------------------------------------------------------------
entity "Người dùng (User)" as User {
  *id : int <<PK>>
  --
  tên_đăng_nhập : string <<UK>>
  mật_khẩu : string
  email : string <<UK>>
  họ_tên : string
  vai_trò : string  'ADMIN / GIẢNG_VIÊN / SINH_VIÊN
}

entity "Hồ sơ Sinh viên (Student)" as Student {
  *id : int <<PK>>
  --
  mã_sinh_viên : string <<UK>>
  class_id : int <<FK>>
  user_id : int <<FK>> <<UK>>
}

entity "Hồ sơ Giám thị (Supervisor)" as Supervisor {
  *id : int <<PK>>
  --
  mã_giám_thị : string <<UK>>
  user_id : int <<FK>> <<UK>>
}

entity "Môn học (Course)" as Course {
  *id : int <<PK>>
  --
  mã_môn_học : string <<UK>>
  tên_môn_học : string
}

entity "Phòng thi (Room)" as Room {
  *id : int <<PK>>
  --
  mã_phòng : string <<UK>>
  sức_chứa : int
  trụ_sở : string
}

entity "Đợt thi (ExamSession)" as ExamSession {
  *id : int <<PK>>
  --
  tên_đợt_thi : string
  ngày_bắt_đầu : date
  ngày_kết_thúc : date
}


'==================== CỤM 2: DỮ LIỆU ĐẦU VÀO CHO THUẬT TOÁN (ALGORITHM INPUT) ====================
' Dữ liệu từ cụm này sẽ được xử lý để tạo ra các "Nhóm thi" - đơn vị cơ bản để xếp lịch.
'------------------------------------------------------------------------------------------------
entity "SV Đăng ký học phần (StudentCourseRegistration)" as StudentCourseReg {
    *student_id : int <<PK>> <<FK>>
    *course_id : int <<PK>> <<FK>>
    *session_id : int <<PK>> <<FK>> 'Xác định SV đăng ký môn này cho đợt thi nào
}

entity "Nhóm thi (ExamGroup)" as ExamGroup {
  *id : int <<PK>>
  --
  mã_nhóm_thi : string <<UK>>
  số_lượng_sv_dự_kiến : int
  course_id : int <<FK>>
  session_id : int <<FK>>
  trạng_thái : string 'Chưa xếp / Đã xếp
}

entity "SV thuộc Nhóm thi (StudentExamGroup)" as StudentExamGroup {
    *student_id : int <<PK>> <<FK>>
    *exam_group_id : int <<PK>> <<FK>>
}


'==================== CỤM 3: QUẢN LÝ RÀNG BUỘC LINH HOẠT (FLEXIBLE CONSTRAINTS) ====================
' Đây là phần "mạnh mẽ" nhất, cho phép Admin định nghĩa quy tắc cho thuật toán.
'-------------------------------------------------------------------------------------------------
entity "Loại Ràng buộc (Constraint)" as Constraint {
    *id : int <<PK>>
    --
    mã_ràng_buộc : string <<UK>> 'e.g., NO_CAMPUS_TRAVEL
    mô_tả : string
    loại : string 'CỨNG / MỀM
}

entity "Quy tắc Ràng buộc (ConstraintRule)" as ConstraintRule {
    *id : int <<PK>>
    --
    session_id : int <<FK>> 'Áp dụng cho đợt thi nào
    constraint_id : int <<FK>>
    is_active : bool 'Cho phép bật/tắt ràng buộc
    tham_số : json 'e.g., {"max_exams_per_day": 1}
}


'==================== CỤM 4: DỮ LIỆU ĐẦU RA CỦA THUẬT TOÁN (ALGORITHM OUTPUT) ====================
' Đây là kết quả cuối cùng sau khi thuật toán chạy thành công.
'-------------------------------------------------------------------------------------------------
entity "Lịch thi (Exam)" as Exam {
  *id : int <<PK>>
  --
  ngày_thi : date
  ca_thi: int '1: Sáng, 2: Chiều, 3: Tối
  exam_group_id : int <<FK>>
  room_id : int <<FK>>
}

entity "Phiếu dự thi (ExamRegistration)" as ExamRegistration {
  *id : int <<PK>>
  --
  'Không cần số báo danh, số ghế
  exam_id : int <<FK>>
  student_id : int <<FK>>
}

entity "Phân công coi thi (ExamSupervisor)" as ExamSupervisor {
  *exam_id : int <<PK>> <<FK>>
  *supervisor_id : int <<PK>> <<FK>>
  --
  vai_trò : string 'Chính / Phụ
}


'==================== QUAN HỆ ====================
User ||--o| Student
User ||--o| Supervisor

Student ||--|{ StudentCourseReg
Course ||--|{ StudentCourseReg
ExamSession ||--|{ StudentCourseReg

Course ||--o{ ExamGroup
ExamSession ||--o{ ExamGroup
ExamGroup ||--|{ StudentExamGroup
Student ||--|{ StudentExamGroup

ExamSession ||--o{ ConstraintRule
Constraint ||--o{ ConstraintRule

ExamGroup }o--|| Exam
Room ||--o{ Exam

Exam ||--o{ ExamRegistration
Student ||--o{ ExamRegistration
Exam ||--|{ ExamSupervisor
Supervisor ||--o{ ExamSupervisor
@enduml