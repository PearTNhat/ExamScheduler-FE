import { http } from "~/utils/http";

const apiGetStudentCourseRegistrations = async () => {
    try {
        const { data } = await http.get("/student-course-registrations");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiCreateStudentCourseRegistration = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/student-course-registrations", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdateStudentCourseRegistration = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/student-course-registrations/${id}`, body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeleteStudentCourseRegistration = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/student-course-registrations/${id}`, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

// API lấy danh sách môn học theo kỳ thi với phân trang và tìm kiếm
const apiGetCoursesByExamSession = async (accessToken, examSessionId, params = {}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                ...params,
                examSessionId: examSessionId // Thêm examSessionId vào params
            }
        };

        const { data } = await http.get(
            `/student-course-registrations/exam-session/${examSessionId}/courses`,
            config
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

// API lấy danh sách sinh viên theo môn học với phân trang và tìm kiếm
const apiGetStudentsByCourse = async (accessToken, courseDepartmentId, params = {}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        };
        const { data } = await http.get(
            `/student-course-registrations/course-department/${courseDepartmentId}/students`,
            config
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

// API cập nhật hàng loạt đăng ký học phần
const apiBulkUpdateRegistrations = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put('/student-course-registrations/bulk-update', body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export {
    apiGetStudentCourseRegistrations,
    apiCreateStudentCourseRegistration,
    apiUpdateStudentCourseRegistration,
    apiDeleteStudentCourseRegistration,
    apiGetCoursesByExamSession,
    apiGetStudentsByCourse,
    apiBulkUpdateRegistrations
};
