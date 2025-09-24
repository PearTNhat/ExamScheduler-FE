import { Route, Routes } from "react-router-dom";
import { publicPaths } from "./constants/path";
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
import TeacherManager from "./pages/admin/teacher/TeacherManager";
import ImportRegistrations from "./pages/admin/import-registrations/ImportRegistrations";
import ExamGroups from "./pages/admin/exam-groups/ExamGroups";
import AutoSchedule from "./pages/admin/auto-schedule/AutoSchedule";
import ViewSchedule from "./pages/admin/view-schedule/ViewSchedule";

function App() {
  return (
    <div className="relative h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="exam-sessions" element={<ExamSessions />} />
          <Route path="courses" element={<Courses />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="students" element={<StudentManager />} />
          <Route path="teachers" element={<TeacherManager />} />
          <Route
            path="import-registrations"
            element={<ImportRegistrations />}
          />
          <Route path="exam-groups" element={<ExamGroups />} />
          <Route path="auto-schedule" element={<AutoSchedule />} />
          <Route path="view-schedule" element={<ViewSchedule />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
