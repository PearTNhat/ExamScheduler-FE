Bước 0: Chuẩn bị Dữ liệu Nền tảng (Admin làm một lần)
Trước khi mọi thứ bắt đầu, Admin đã nhập các dữ liệu cơ bản vào hệ thống.
Bảng 
id: 1, tên_đăng_nhập: 'admin', họ_tên: 'Quản trị viên', vai_trò: 'ADMIN'
id: 2, tên_đăng_nhập: 'an.nv', họ_tên: 'Nguyễn Văn An', vai_trò: 'SINH_VIEN'
id: 3, tên_đăng_nhập: 'binh.tt', họ_tên: 'Trần Thị Bình', vai_trò: 'SINH_VIEN'


Bảng 
id: 1, mã_sinh_viên: 'SV001', user_id: 2
id: 2, mã_sinh_viên: 'SV002', user_id: 3


Bảng 
id: 1, mã_môn_học: 'CS101', tên_môn_học: 'Lập trình hướng đối tượng'
id: 2, mã_môn_học: 'CS201', tên_môn_học: 'Cấu trúc dữ liệu'
id: 3, mã_môn_học: 'MA101', tên_môn_học: 'Toán rời rạc'


Bảng 
id: 1, mã_phòng: 'P101', sức_chứa: 50, trụ_sở: 'Cầu Giấy'
id: 2, mã_phòng: 'P102', sức_chứa: 50, trụ_sở: 'Cầu Giấy'


Bảng 
id: 1, tên_đợt_thi: 'Cuối kỳ 2023', ngày_bắt_đầu: '2023-12-15', ngày_kết_thúc: '2023-12-30'



Bước 1: Nhập Dữ liệu Đăng ký thi (Admin thực hiện)
Đây là bước thay thế cho việc sinh viên tự đăng ký. Admin có một file Excel từ phòng đào tạo.
File 
| ma_sinh_vien | ma_mon_hoc |
|--------------|------------|
| SV001 | CS101 |
| SV001 | CS201 |
| SV002 | CS101 |
| SV002 | MA101 |
Admin vào hệ thống, chọn đợt thi "Cuối kỳ 2023", và upload file này lên.
Hệ thống làm gì?
Đọc từng dòng trong file Excel.
Với mỗi dòng, tìm student_id tương ứng với ma_sinh_vien và course_id tương ứng với ma_mon_hoc.
Thêm bản ghi mới vào bảng StudentCourseRegistration.


Dữ liệu thay đổi trong DB:
Bảng 
student_id: 1, course_id: 1, session_id: 1 (An đăng ký CS101)
student_id: 1, course_id: 2, session_id: 1 (An đăng ký CS201)
student_id: 2, course_id: 1, session_id: 1 (Bình đăng ký CS101)
student_id: 2, course_id: 3, session_id: 1 (Bình đăng ký MA101)




Lúc này, hệ thống đã biết chính xác ai cần thi môn gì.

Bước 2: Tạo Nhóm thi (Admin thực hiện)
Admin vào chức năng "Quản lý Nhóm thi", chọn đợt thi "Cuối kỳ 2023".
Hệ thống làm gì?
Quét bảng StudentCourseRegistration để xem mỗi môn có bao nhiêu sinh viên đăng ký.
CS101: 2 sinh viên (An, Bình)
CS201: 1 sinh viên (An)
MA101: 1 sinh viên (Bình)


Dựa trên sĩ số và cấu hình (ví dụ: mỗi nhóm tối đa 50 sinh viên), hệ thống đề xuất tạo các nhóm thi. Ở đây, mỗi môn chỉ cần 1 nhóm.
Admin xác nhận. Hệ thống tạo các bản ghi trong ExamGroup và StudentExamGroup.


Dữ liệu thay đổi trong DB:
Bảng 
id: 1, mã_nhóm_thi: 'CS101-CK2023-01', số_lượng_sv_dự_kiến: 2, course_id: 1, session_id: 1, trạng_thái: 'Chưa xếp'
id: 2, mã_nhóm_thi: 'CS201-CK2023-01', số_lượng_sv_dự_kiến: 1, course_id: 2, session_id: 1, trạng_thái: 'Chưa xếp'
id: 3, mã_nhóm_thi: 'MA101-CK2023-01', số_lượng_sv_dự_kiến: 1, course_id: 3, session_id: 1, trạng_thái: 'Chưa xếp'


Bảng 
student_id: 1, exam_group_id: 1 (An thuộc nhóm CS101)
student_id: 2, exam_group_id: 1 (Bình thuộc nhóm CS101)
student_id: 1, exam_group_id: 2 (An thuộc nhóm CS201)
student_id: 2, exam_group_id: 3 (Bình thuộc nhóm MA101)





Bước 3: Cấu hình Ràng buộc và Chạy Xếp lịch (Admin thực hiện)
Admin vào trang "Xếp lịch tự động", chọn đợt thi "Cuối kỳ 2023". Anh ta thấy danh sách các ràng buộc và bật/tắt chúng. Giả sử anh ta để mặc định: Ràng buộc cứng  (sinh viên không trùng lịch) được bật.
Sau đó, Admin nhấn nút "Bắt đầu Xếp lịch".
Hệ thống (Thuật toán) làm gì?
Lấy danh sách các ExamGroup có trạng_thái = 'Chưa xếp' (ở đây là 3 nhóm).
Lấy danh sách các Room có sẵn.
Lấy danh sách các ca thi có thể (ví dụ: Sáng/Chiều từ 15/12 đến 30/12).
Thuật toán bắt đầu thử các phương án:
Thử xếp Nhóm 1 (CS101) vào phòng P101, sáng 15/12.
Thử xếp Nhóm 2 (CS201) vào phòng P102, sáng 15/12.
Kiểm tra ràng buộc: Lấy danh sách sinh viên của Nhóm 1 (An, Bình) và Nhóm 2 (An). Thấy rằng sinh viên An bị trùng lịch. => Phương án này không hợp lệ, hủy bỏ.
Thuật toán quay lui, thử phương án khác: Xếp Nhóm 2 (CS201) vào chiều 15/12.
Kiểm tra ràng buộc: Không có sinh viên nào trùng lịch. => Phương án này hợp lệ.
Tiếp tục xếp Nhóm 3 (MA101).


Sau khi tìm được một lời giải hợp lệ, thuật toán dừng lại.


Dữ liệu thay đổi trong DB:
Hệ thống tạo ra các bản ghi Exam (lịch thi cụ thể).
Cập nhật trạng_thái trong ExamGroup.
Tạo các "phiếu dự thi" trong ExamRegistration.
Bảng 
id: 1, ngày_thi: '2023-12-15', ca_thi: 1, exam_group_id: 1, room_id: 1 (Lịch thi cho nhóm CS101)
id: 2, ngày_thi: '2023-12-15', ca_thi: 2, exam_group_id: 2, room_id: 1 (Lịch thi cho nhóm CS201)
id: 3, ngày_thi: '2023-12-16', ca_thi: 1, exam_group_id: 3, room_id: 2 (Lịch thi cho nhóm MA101)


Bảng 
id: 1, ..., trạng_thái: 'Đã xếp'
id: 2, ..., trạng_thái: 'Đã xếp'
id: 3, ..., trạng_thái: 'Đã xếp'


Bảng 
id: 1, exam_id: 1, student_id: 1 (Phiếu dự thi của An cho môn CS101)
id: 2, exam_id: 1, student_id: 2 (Phiếu dự thi của Bình cho môn CS101)
id: 3, exam_id: 2, student_id: 1 (Phiếu dự thi của An cho môn CS201)
id: 4, exam_id: 3, student_id: 2 (Phiếu dự thi của Bình cho môn MA101)





Bước 4: Công bố lịch và Tra cứu (Sinh viên thực hiện)
Admin sau khi rà soát đã công bố lịch thi.
Sinh viên An (
Hệ thống làm gì?
Lấy user_id của An là 2.
Tìm trong bảng Student có user_id = 2 để lấy student_id của An là 1.
Truy vấn bảng ExamRegistration: SELECT * FROM ExamRegistration WHERE student_id = 1. Hệ thống tìm thấy 2 bản ghi có id là 1 và 3.
Dựa vào exam_id từ 2 bản ghi này (là 1 và 2), hệ thống JOIN với bảng Exam để lấy thông tin chi tiết (ngày, ca, phòng).
JOIN tiếp để lấy tên môn học, tên phòng...


Kết quả hiển thị cho An:
Môn: Lập trình hướng đối tượng - Ngày thi: 15/12/2023 - Ca: 1 (Sáng) - Phòng: P101
Môn: Cấu trúc dữ liệu - Ngày thi: 15/12/2023 - Ca: 2 (Chiều) - Phòng: P101




Luồng dữ liệu này cho thấy hệ thống hoạt động một cách logic, có trật tự, mỗi bảng được sinh ra và cập nhật vào đúng thời điểm, phục vụ cho bước tiếp theo trong quy trình nghiệp vụ.

