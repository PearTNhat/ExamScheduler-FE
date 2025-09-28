const publicPaths = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
};

const adminPaths = {
    DASHBOARD: '/admin',
    EXAM_SESSIONS: '/admin/exam-sessions',
    COURSES: '/admin/courses',
    ROOMS: '/admin/rooms',
    STUDENTS: '/admin/students',
    TEACHERS: '/admin/teachers',
    IMPORT_REGISTRATIONS: '/admin/import-registrations',
    STUDENT_COURSE_REGISTRATIONS: '/admin/student-course-registrations',
    EXAM_GROUPS: '/admin/exam-groups',
    SCHEDULE: '/admin/schedule',
    AUTO_SCHEDULE: '/admin/auto-schedule',
    VIEW_SCHEDULE: '/admin/view-schedule',
};

export { publicPaths, adminPaths };