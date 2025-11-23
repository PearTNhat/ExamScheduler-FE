import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "~/utils/alert";
import { apiGetExamSessions } from "~/apis/exam-sessionsApi";
import {
  apiGetCoursesByExamSession,
  apiGetStudentsByCourse,
  apiBulkUpdateRegistrations,
} from "~/apis/student-course-registrationsApi";
import { PageHeader, CoursesList } from "./components/CourseComponents";
import StudentManagementModal from "./components/StudentManagementModal";
import AddCourseDepartmentModal from "./components/AddCourseDepartmentModal";
import {
  apiCreateCourseDepartment,
  apiDeleteCourseDepartment,
} from "~/apis/course-departmentApi";

const StudentCourseRegistrationManager = () => {
  const { accessToken } = useSelector((state) => state.user);

  // State quản lý chính
  const [examSessions, setExamSessions] = useState([]);
  const [selectedExamSession, setSelectedExamSession] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  // State phân trang courses
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesLimit] = useState(10);
  const [courseSearch, setCourseSearch] = useState("");
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);

  // State phân trang students
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [registeredFilter, setRegisteredFilter] = useState("all");
  const [studentsTotalPages, setStudentsTotalPages] = useState(1);

  // State loading và modal
  const [loading, setLoading] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddCourseDepartmentModal, setShowAddCourseDepartmentModal] =
    useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // State cho student selection
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Load exam sessions khi component mount
  const loadExamSessions = useCallback(async () => {
    try {
      const response = await apiGetExamSessions({ accessToken });
      if (response.code === 200) {
        setExamSessions(response.data || []);
      } else {
        toast.error(response.message || "Lỗi khi tải kỳ thi");
      }
    } catch (error) {
      console.error("Error loading exam sessions:", error);
      toast.error("Không thể tải danh sách kỳ thi");
    }
  }, [accessToken]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGetCoursesByExamSession(
        accessToken,
        selectedExamSession,
        {
          page: coursesPage,
          limit: coursesLimit,
          search: courseSearch,
        }
      );

      if (response.code === 200) {
        console.log(response.data.data);
        setCourses(response.data.data || []);
        console.log("re", response.data);
        setCoursesTotalPages(response.data.meta.totalPages || 1);
      } else {
        toast.error(response.message || "Lỗi khi tải môn học");
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    selectedExamSession,
    coursesPage,
    coursesLimit,
    courseSearch,
  ]);
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      console.log("select");
      const response = await apiGetStudentsByCourse(
        accessToken,
        selectedCourse.id,
        selectedExamSession,
        {
          page: studentsPage,
          limit: 1000,
          search: studentSearch,
          lecturerId: selectedCourse.lecturerId,
          classId: selectedCourse.classId,
        }
      );
      if (response.code === 200) {
        setStudents(response.data.data || []);
        setStudentsTotalPages(response.data.meta.totalPages || 1);
        const registeredStudentIds =
          response.data.data
            .filter((item) => item.isRegistered)
            .map((item) => item.id) || [];
        setSelectedStudents(registeredStudentIds);
      } else {
        toast.error(response.message || "Lỗi khi tải sinh viên");
      }
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Không thể tải danh sách sinh viên" + error.message);
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    selectedCourse,
    selectedExamSession,
    studentsPage,
    studentSearch,
  ]);

  useEffect(() => {
    if (accessToken) {
      loadExamSessions();
    }
  }, [accessToken, loadExamSessions]);

  // Load courses khi exam session thay đổi
  useEffect(() => {
    if (selectedExamSession && accessToken) {
      loadCourses();
    }
  }, [selectedExamSession, loadCourses, accessToken]);

  // Load students khi course thay đổi
  useEffect(() => {
    if (selectedCourse && selectedExamSession && accessToken) {
      loadStudents();
    }
  }, [selectedCourse, selectedExamSession, loadStudents, accessToken]);

  // Reset course page khi search thay đổi
  useEffect(() => {
    setCoursesPage(1);
  }, [courseSearch]);

  // Reset student page khi search/filter thay đổi
  useEffect(() => {
    setStudentsPage(1);
  }, [studentSearch, registeredFilter]);

  const handleCourseSelect = useCallback((course) => {
    console.log("Selected course:", course);
    setSelectedCourse(course);
    setShowStudentModal(true);
    setStudentsPage(1);
    setStudentSearch("");
    setRegisteredFilter("all");
    setSelectedStudents([]);
  }, []);

  const handleExamSessionChange = useCallback((sessionId) => {
    setSelectedExamSession(sessionId);
    setCoursesPage(1);
    setCourseSearch("");
    setCourses([]);
  }, []);

  const handleStudentSelect = useCallback((studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  }, []);

  const handleAddStudentToList = useCallback((student) => {
    setStudents((prev) => {
      if (prev.some((s) => s.id === student.id)) {
        return prev;
      }
      return [student, ...prev];
    });
  }, []);

  const handleRemoveStudentFromList = useCallback((studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, []);

  const handleSelectAllInPage = useCallback(
    (isChecked) => {
      if (isChecked) {
        const pageStudentIds = students.map((item) => item.id);
        setSelectedStudents((prev) => [
          ...new Set([...prev, ...pageStudentIds]),
        ]);
      } else {
        const pageStudentIds = students.map((item) => item.id);
        setSelectedStudents((prev) =>
          prev.filter((id) => !pageStudentIds.includes(id))
        );
      }
    },
    [students]
  );

  const handleBulkUpdate = async (changes) => {
    setBulkLoading(true);
    try {
      const data = {
        ...changes,
        examSessionId: parseInt(selectedExamSession),
        courseId: selectedCourse.id,
      };
      const response = await apiBulkUpdateRegistrations({
        body: data,
        accessToken,
      });

      if (response.code === 200) {
        toast.success(response.message || "Cập nhật thành công");
        await Promise.all([loadStudents(), loadCourses()]);
      } else {
        toast.error(response.message || "Lỗi khi cập nhật");
      }
    } catch (error) {
      console.error("Error bulk updating registrations:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleCreateCourseDepartment = async (data) => {
    setBulkLoading(true);
    try {
      const response = await apiCreateCourseDepartment({
        body: data,
        accessToken,
      });

      if (response.code === 201 || response.code === 200) {
        toast.success("Tạo đăng ký học phần thành công");
        setShowAddCourseDepartmentModal(false);
        // Reload courses nếu đang ở exam session được chọn
        if (selectedExamSession === data.examSessionId.toString()) {
          await loadCourses();
        }
      } else {
        toast.error(response.message || "Lỗi khi tạo đăng ký học phần");
      }
    } catch (error) {
      console.error("Error creating course department:", error);
      toast.error("Có lỗi xảy ra khi tạo đăng ký học phần");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteCourseDepartment = async (course) => {
    if (course.registeredCount > 0) {
      toast.error("Không thể xóa môn học đã có sinh viên đăng ký");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa môn học "${course.nameCourse}" khỏi kỳ thi này?`
    );

    if (!confirmed) return;

    setBulkLoading(true);
    try {
      const response = await apiDeleteCourseDepartment({
        id: course.id,
        accessToken,
      });

      if (response.code === 200) {
        toast.success("Xóa môn học thành công");
        await loadCourses();
      } else {
        toast.error(response.message || "Lỗi khi xóa môn học");
      }
    } catch (error) {
      console.error("Error deleting course department:", error);
      toast.error("Có lỗi xảy ra khi xóa môn học");
    } finally {
      setBulkLoading(false);
    }
  };

  const isAllPageSelected =
    students.length > 0 &&
    students.every((item) => selectedStudents.includes(item.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <PageHeader onAddClick={() => setShowAddCourseDepartmentModal(true)} />

      <CoursesList
        courses={courses}
        loading={loading}
        searchTerm={courseSearch}
        onSearchChange={setCourseSearch}
        onCourseSelect={handleCourseSelect}
        onDeleteCourse={handleDeleteCourseDepartment}
        pagination={{
          currentPage: coursesPage,
          totalPages: coursesTotalPages,
        }}
        onPageChange={setCoursesPage}
        // Props cho exam session selector
        examSessions={examSessions}
        selectedExamSession={selectedExamSession}
        onSelectExamSession={handleExamSessionChange}
      />

      <StudentManagementModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        course={selectedCourse}
        students={students}
        loading={loading}
        searchTerm={studentSearch}
        onSearchChange={setStudentSearch}
        selectedStudents={selectedStudents}
        onStudentSelect={handleStudentSelect}
        onSelectAllInPage={handleSelectAllInPage}
        isAllPageSelected={isAllPageSelected}
        onBulkUpdate={handleBulkUpdate}
        bulkLoading={bulkLoading}
        pagination={{
          currentPage: studentsPage,
          totalPages: studentsTotalPages,
        }}
        onPageChange={setStudentsPage}
        examSessionId={selectedExamSession}
        onAddStudentToList={handleAddStudentToList}
        onRemoveStudentFromList={handleRemoveStudentFromList}
        lecturerId={selectedCourse?.lecturerId}
        classId={selectedCourse?.classId}
      />

      <AddCourseDepartmentModal
        open={showAddCourseDepartmentModal}
        onOpenChange={setShowAddCourseDepartmentModal}
        onSubmit={handleCreateCourseDepartment}
        loading={bulkLoading}
        examSessions={examSessions}
      />
    </div>
  );
};

export default StudentCourseRegistrationManager;
