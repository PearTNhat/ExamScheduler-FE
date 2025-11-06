# Hướng Dẫn Sử Dụng Trang Xem Lịch Thi

## Tổng quan

Hệ thống cung cấp 2 trang để xem lịch thi:

1. **ViewSchedule** (`/admin/view-schedule`) - Xem danh sách kỳ thi dạng bảng/lịch
2. **ViewExamTimetable** (`/admin/exam-timetable`) - Xem lịch thi theo thời gian biểu chi tiết

## 1. Trang ViewSchedule (Gốc)

### URL
```
/admin/view-schedule
```

### Tính năng
- ✅ Xem danh sách kỳ thi dạng bảng hoặc lịch (calendar)
- ✅ Tìm kiếm và lọc theo đợt thi
- ✅ Thêm/Sửa/Xóa kỳ thi
- ✅ Xem chi tiết kỳ thi (có danh sách sinh viên và giám thị)
- ✅ Thống kê số lượng kỳ thi

### Cách sử dụng
1. Chọn chế độ xem: Danh sách hoặc Lịch
2. Sử dụng bộ lọc để tìm kiếm
3. Click vào một kỳ thi để xem chi tiết
4. Modal chi tiết sẽ hiển thị:
   - Thông tin ca thi
   - Danh sách sinh viên (Tab 1)
   - Danh sách giám thị (Tab 2)

## 2. Trang ViewExamTimetable (Mới)

### URL
```
/admin/exam-timetable
```

### Tính năng
- ✅ Hiển thị lịch thi theo định dạng thời gian biểu
- ✅ Nhóm theo ngày, chia buổi sáng/chiều
- ✅ Lọc theo khoảng thời gian (từ ngày - đến ngày)
- ✅ Lọc theo đợt thi
- ✅ Hiển thị đầy đủ thông tin: môn học, phòng thi, giám thị, số SV
- ✅ Click vào kỳ thi để xem chi tiết sinh viên và giám thị
- ✅ Thống kê tổng số: kỳ thi, ngày thi, sinh viên

### Cách sử dụng

#### Bước 1: Lọc dữ liệu
```
1. Chọn "Từ ngày" và "Đến ngày" (hoặc để trống để xem tất cả)
2. Chọn "Đợt thi" (hoặc chọn "Tất cả")
3. Click "Áp dụng" để lọc
4. Click "Đặt lại" để xóa bộ lọc
```

#### Bước 2: Xem lịch thi
- Lịch thi được nhóm theo từng ngày
- Mỗi ngày hiển thị 2 buổi:
  - 🟡 **Buổi sáng**: Các kỳ thi trước 12:00
  - 🟠 **Buổi chiều**: Các kỳ thi từ 12:00 trở đi

#### Bước 3: Xem chi tiết
- Click nút "Chi tiết" trên bất kỳ kỳ thi nào
- Modal sẽ hiển thị:
  - **Thông tin ca thi**: Ngày, giờ, thời lượng, trạng thái
  - **Thông tin môn học**: Mã nhóm, tên môn, phòng thi
  - **Tab Sinh viên**: Danh sách đầy đủ sinh viên tham dự
  - **Tab Giám thị**: Danh sách giám thị và vai trò

## 3. Modal Chi Tiết Kỳ Thi

### Cấu trúc

#### A. Thông tin cơ bản
```
┌─────────────────────────────────────┐
│ Thông tin ca thi    │ Thông tin môn │
│ - Ngày thi          │ - Mã nhóm thi │
│ - Ca thi            │ - Học phần    │
│ - Thời lượng        │ - Mã HP       │
│ - Trạng thái        │ - Phòng thi   │
└─────────────────────────────────────┘
```

#### B. Tab Sinh viên
```
┌─────────────────────────────────────────────────────┐
│ 📊 Danh sách sinh viên          [Xuất danh sách]   │
├─────┬──────────┬──────────────┬───────┬────────────┤
│ STT │ Mã SV    │ Họ và tên    │ Lớp   │ Email      │
├─────┼──────────┼──────────────┼───────┼────────────┤
│  1  │ B21DCCN  │ Nguyễn Văn A │ K66A  │ email@... │
│  2  │ B21DCCN  │ Trần Thị B   │ K66A  │ email@... │
└─────┴──────────┴──────────────┴───────┴────────────┘
```

#### C. Tab Giám thị
```
┌─────────────────────────────────────────────────────┐
│ 👨‍🏫 Danh sách giám thị          [Xuất danh sách]   │
├─────┬──────────┬──────────────┬──────────┬─────────┤
│ STT │ Mã GV    │ Họ và tên    │ Vai trò  │ Email   │
├─────┼──────────┼──────────────┼──────────┼─────────┤
│  1  │ GV001    │ Nguyễn Văn C │Supervisor│email@...│
│  2  │ GV002    │ Trần Thị D   │Assistant │email@...│
└─────┴──────────┴──────────────┴──────────┴─────────┘
```

## 4. API được sử dụng

### Timetable API
```javascript
GET /api/exams/timetable/view
Params:
  - startDate: string (YYYY-MM-DD)
  - endDate: string (YYYY-MM-DD)
  - examSessionId: number

Response:
{
  timetable: [
    {
      day: "Thứ Hai",
      date: "2025-01-15",
      morning: [...],
      afternoon: [...]
    }
  ],
  totalExams: 100
}
```

### Detail API
```javascript
GET /api/exams/:id/detail

Response:
{
  id: 1,
  examDate: "2025-01-15",
  duration: 90,
  status: "Draft",
  courseName: "Lập trình cơ bản",
  students: [
    {
      id: 1,
      studentCode: "B21DCCN001",
      fullName: "Nguyễn Văn A",
      email: "email@example.com",
      className: "K66A"
    }
  ],
  supervisors: [
    {
      id: 1,
      lecturerCode: "GV001",
      fullName: "Phạm Văn C",
      email: "email@example.com",
      role: "Supervisor"
    }
  ]
}
```

## 5. Cấu trúc File

```
view-schedule/
├── ViewSchedule.jsx              # Trang xem lịch gốc (bảng/lịch)
├── ViewExamTimetable.jsx         # Trang xem lịch theo thời gian biểu
└── components/
    ├── ExamCalendar.jsx          # Component lịch FullCalendar
    ├── ExamListView.jsx          # Component danh sách bảng
    ├── ExamFormModal.jsx         # Modal thêm/sửa kỳ thi
    └── ExamDetailModal.jsx       # Modal chi tiết (CẬP NHẬT MỚI)
```

## 6. Components Mới

### ViewExamTimetable
- Hiển thị lịch thi theo format từ API `/exams/timetable/view`
- Nhóm theo ngày và buổi (sáng/chiều)
- Có bộ lọc theo thời gian và đợt thi

### ExamDetailModal (Đã cập nhật)
- Hỗ trợ cả 2 mode:
  1. **Mode cũ**: Nhận prop `exam` (object)
  2. **Mode mới**: Nhận prop `examId` và `accessToken`, tự động fetch detail
- Hiển thị 2 tabs:
  - Tab Sinh viên: Danh sách đầy đủ sinh viên
  - Tab Giám thị: Danh sách giám thị với vai trò
- Có nút xuất danh sách (chưa implement)

### ExamCard (Component con)
- Hiển thị thông tin một kỳ thi trong timetable
- Có nút "Chi tiết" để xem thêm

## 7. UI Components Mới

### Tabs (`components/ui/tabs.jsx`)
```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

<Tabs defaultValue="students">
  <TabsList>
    <TabsTrigger value="students">Sinh viên</TabsTrigger>
    <TabsTrigger value="supervisors">Giám thị</TabsTrigger>
  </TabsList>
  <TabsContent value="students">...</TabsContent>
  <TabsContent value="supervisors">...</TabsContent>
</Tabs>
```

### Table (Đã có sẵn)
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table";
```

## 8. Dependencies

Cần cài đặt package mới (nếu chưa có):
```bash
npm install @radix-ui/react-tabs
```

## 9. Thêm vào Navigation

Cập nhật file navigation để thêm menu mới:

```javascript
// constants/navAdmin.jsx
{
  name: "Lịch thi chi tiết",
  path: "/admin/exam-timetable",
  icon: CalendarDays,
}
```

## 10. Tính năng sắp tới

- [ ] Xuất danh sách sinh viên ra Excel/PDF
- [ ] Xuất danh sách giám thị ra Excel/PDF
- [ ] In lịch thi
- [ ] Gửi email thông báo cho sinh viên
- [ ] Gửi email thông báo cho giám thị
- [ ] Filter nâng cao (theo phòng, theo giảng viên...)
- [ ] Xem lịch thi của một sinh viên cụ thể
- [ ] Xem lịch coi thi của một giảng viên cụ thể

## 11. Lưu ý

1. **Authentication**: Cần đăng nhập và có quyền admin
2. **Loading State**: Hiển thị spinner khi đang tải dữ liệu
3. **Error Handling**: Hiển thị toast message khi có lỗi
4. **Empty State**: Hiển thị thông báo khi không có dữ liệu
5. **Responsive**: Giao diện tương thích với mobile/tablet

## 12. Troubleshooting

### Lỗi: "Cannot read property 'students' of undefined"
**Nguyên nhân**: API chưa trả về data  
**Giải pháp**: Kiểm tra backend đã chạy và API endpoint đúng

### Lỗi: "@radix-ui/react-tabs not found"
**Nguyên nhân**: Package chưa được cài  
**Giải pháp**: 
```bash
npm install @radix-ui/react-tabs
```

### Không hiển thị danh sách sinh viên/giám thị
**Nguyên nhân**: Kỳ thi chưa có sinh viên/giám thị được phân công  
**Giải pháp**: Đảm bảo đã chạy thuật toán xếp lịch và tạo registrations/supervisors

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 2025-01-15  
**Version**: 1.0.0
