const publicPaths = {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    RESET_PASSWORD: '/reset-password',
    USER: '/user',
};

const adminPaths = {
    // DASHBOARD: '/admin',
    EXAM_SESSIONS: '/admin',
    ACADEMIC_YEARS: '/admin/academic-years',
    EXAM_SLOTS: '/admin/exam-slots',
    COURSES: '/admin/courses',
    DEPARTMENTS: '/admin/departments',
    LOCATIONS: '/admin/locations',
    ROOMS: '/admin/rooms',
    EXAM_GROUPS: '/admin/exam-groups',
    CLASSES: '/admin/classes',
    STUDENTS: '/admin/students',
    LECTURES: '/admin/lectures',
    SCHEDULE: '/admin/schedule',
    IMPORT_REGISTRATIONS: '/admin/import-registrations',
    STUDENT_COURSE_REGISTRATIONS: '/admin/student-course-registrations',
    AUTO_SCHEDULE: '/admin/auto-schedule',
    VIEW_SCHEDULE: '/admin/view-schedule',
    VIEW_SCHEDULE_S_L: '/admin/view-schedule-s-l',
};

export { publicPaths, adminPaths };