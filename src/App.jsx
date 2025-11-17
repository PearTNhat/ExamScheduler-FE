import { Route, Routes } from "react-router-dom";
import { publicPaths } from "~/constants/path";
import Login from "./pages/public/auth/login/Login";
import Register from "./pages/public/auth/register/Register";
import PublicLayout from "./pages/public/PublicLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import Home from "./pages/public/home/Home";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ExamSessions from "./pages/admin/exam-sessions/ExamSessions";
import Courses from "./pages/admin/courses/Courses";
import Rooms from "./pages/admin/rooms/Rooms";
import StudentManager from "./pages/admin/student/StudentManager";

import AutoSchedule from "./pages/admin/auto-schedule/AutoSchedule";
import ViewExamTimetable from "./pages/admin/view-schedule/ViewExamTimetable";
import UserLayout from "./pages/public/user/UserLayout";
import UserProfile from "./pages/public/user/userProfile/UserProfile";
import ChangePassword from "./pages/public/user/changePassword/ChangePassword";
import ExamSchedule from "./pages/public/user/examSchedule/ExamSchedule";
import RegisteredCourses from "./pages/public/user/registeredCourses/RegisteredCourses";
import Departments from "./pages/admin/departments/Departments";
import Locations from "./pages/admin/locations/Locations";
import LecturesManager from "./pages/admin/lectures/LecturesManager";
import NotFound from "./components/NotFound";
import { ScheduleGenerator } from "./pages/admin/schedule/ScheduleGenerator";
import ClassesManager from "./pages/admin/classes/ClassesManager";
import ExamSlotsManager from "./pages/admin/exam-slots/ExamSlotsManager";
import ExamGroupsManager from "./pages/admin/exam-groups/ExamGroupsManager";
import StudentCourseRegistrationManager from "./pages/admin/student-course-registrations/StudentCourseRegistrationManager";
import AcademicYearManager from "./pages/admin/academic-years/AcademicYearManager";

function App() {
  return (
    <div className="relative h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
        </Route>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="exam-schedule" element={<ExamSchedule />} />
          <Route path="registered-courses" element={<RegisteredCourses />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="exam-sessions" element={<ExamSessions />} />
          <Route path="academic-years" element={<AcademicYearManager />} />
          <Route path="courses" element={<Courses />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="students" element={<StudentManager />} />
          <Route path="lectures" element={<LecturesManager />} />
          <Route path="departments" element={<Departments />} />
          <Route path="locations" element={<Locations />} />
          <Route
            path="student-course-registrations"
            element={<StudentCourseRegistrationManager />}
          />
          <Route path="auto-schedule" element={<AutoSchedule />} />

          <Route path="view-schedule" element={<ViewExamTimetable />} />
          <Route path="schedule" element={<ScheduleGenerator />} />
          <Route path="classes" element={<ClassesManager />} />
          <Route path="exam-slots" element={<ExamSlotsManager />} />
          <Route path="exam-groups" element={<ExamGroupsManager />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
