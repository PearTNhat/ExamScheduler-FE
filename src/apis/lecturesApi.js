import { http } from "~/utils/http";

const apiGetLecturers = async ({ accessToken, params }) => {
    try {
        const { data } = await http.get("/lecturers", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetLecturerById = async ({ accessToken, id }) => {
    try {
        const { data } = await http.get(`/lecturers/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiCreateLecturer = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/lecturers", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdateLecturer = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/lecturers/${id}`, body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeleteLecturer = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/lecturers/${id}`, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

// ✅ THÊM MỚI: Lấy lịch coi thi của giảng viên
const apiExamLecturer = async ({ accessToken, lecturerId, examSessionId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        // Thêm examSessionId vào params nếu có
        if (examSessionId) {
            config.params = { examSessionId };
        }

        const { data } = await http.get(`/lecturers/lecturer/${lecturerId}/exams`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export {
    apiGetLecturers,
    apiCreateLecturer,
    apiUpdateLecturer,
    apiDeleteLecturer,
    apiGetLecturerById,
    apiExamLecturer
};
