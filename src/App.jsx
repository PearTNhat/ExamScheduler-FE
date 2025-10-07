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
import ImportRegistrations from "./pages/admin/import-registrations/ImportRegistrations";
import StudentCourseRegistrations from "./pages/admin/student-course-registrations/StudentCourseRegistrationsNew";
import ExamGroups from "./pages/admin/exam-groups/ExamGroups";
import AutoSchedule from "./pages/admin/auto-schedule/AutoSchedule";
import ViewSchedule from "./pages/admin/view-schedule/ViewSchedule";
import UserLayout from "./pages/public/user/UserLayout";
import UserProfile from "./pages/public/user/userProfile/UserProfile";
import ChangePassword from "./pages/public/user/changePassword/ChangePassword";
import ExamSchedule from "./pages/public/user/examSchedule/ExamSchedule";
import RegisteredCourses from "./pages/public/user/registeredCourses/RegisteredCourses";
import ExamResults from "./pages/public/user/examResults/ExamResults";
import Notifications from "./pages/public/user/notifications/Notifications";
import ActivityHistory from "./pages/public/user/activityHistory/ActivityHistory";
import Departments from "./pages/admin/departments/Departments";
import Locations from "./pages/admin/locations/Locations";
import LecturesManager from "./pages/admin/lectures/LecturesManager";
import NotFound from "./components/NotFound";

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
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="activity-history" element={<ActivityHistory />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="exam-sessions" element={<ExamSessions />} />
          <Route path="courses" element={<Courses />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="students" element={<StudentManager />} />
          <Route path="lectures" element={<LecturesManager />} />
          <Route path="departments" element={<Departments />} />
          <Route path="locations" element={<Locations />} />
          <Route
            path="import-registrations"
            element={<ImportRegistrations />}
          />
          <Route
            path="student-course-registrations"
            element={<StudentCourseRegistrations />}
          />
          <Route path="exam-groups" element={<ExamGroups />} />
          <Route path="auto-schedule" element={<AutoSchedule />} />
          <Route path="view-schedule" element={<ViewSchedule />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
